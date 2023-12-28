/**
 * Media View
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import {
	bytesHuman, combine
} from '@ouroboros/tools';
import { copy } from '@ouroboros/browser/clipboard';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Project components
import ConfirmDelete from '../../elements/ConfirmDelete';

// Translations
import TEXT from '../../../translations/media';

/**
 * Media View
 *
 * Handles uploading new media
 *
 * @name View
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function View({
	locale, onClose, onThumbAdded, onThumbRemoved, value
}) {

	// State
	const [ err, errSet ] = useState(false);
	const [ thumb, thumbSet ] = useState(null);

	// Called to add the new thumbnail
	function thumbAdd() {

		// Fill the form
		thumbSet({
			type: 'f',
			height: Math.round(value.image.resolution.height / 2),
			chain: true,
			width: Math.round(value.image.resolution.width / 2)
		});
	}

	// Called when a thumbnail changes
	function thumbChange(type, val) {

		// Make sure we're up to date
		thumbSet(o => {

			// Init new values
			const oNew = { }

			// If we're changing the height or width
			if(type === 'height' || type === 'width') {

				// Make sure we have an int
				val = parseInt(val, 10);

				// If it's higher than it's equivalent file dimension, set it to
				//	that
				if(val > value.image.resolution[type]) {
					val = value.image.resolution[type];
				}

				// If we're chained
				if(thumb.chain) {

					// If we're changing the height
					if(type === 'height') {

						// Get the percentage of the height based on the image height
						const fPerc = value.image.resolution.height / val;

						// Set new values
						oNew.width = Math.round(value.image.resolution.width / fPerc);
					}

					// Else, if we're changing the width
					else {

						// Get the percentage of the height based on the image height
						const fPerc = value.image.resolution.width / val;

						// Set new values
						oNew.height = Math.round(value.image.resolution.height / fPerc);
					}
				}
			}

			// If we're changing the type
			if(type === 'type') {

				// If the new value is crop, turn off chaining
				if(val === 'c') {
					oNew.chain = false;
				}
			}

			// Add the new value
			oNew[type] = val;

			// Merge the new data and return
			return combine(o, oNew);
		});
	}

	// Called to delete an existing thumbnail
	function thumbDelete(size) {

		// Send the request to the server
		blog.delete('admin/media/thumbnail', {
			_id: value._id,
			size
		}).then(data => {
			if(data) {
				onThumbRemoved(size);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Called to generate a new thumbnail
	function thumbSubmit() {

		// Create the size
		const sSize = `${thumb.type}${thumb.width}x${thumb.height}`;

		// Send the request to the server
		blog.create('admin/media/thumbnail', {
			_id: value._id,
			size: sSize
		}).then(data => {
			if(data) {
				thumbSet(null);
				onThumbAdded(sSize, data);
			}
		}, error => {
			if(error.code === errors.body.DB_DUPLICATE) {
				errSet(TEXT[locale].add.thumb.duplicate);
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Dialog
			fullScreen={true}
			id="blog_media_view"
			onClose={onClose}
			open={true}
		>
			<DialogContent className="blog_media_view">
				<i className="fa-solid fa-times-circle close" onClick={onClose} />
				<Box className="blog_media_view_content">
					{value.image ?
						<Box
							className="blog_media_view_photo"
							style={{backgroundImage: `url(${value.urls.source})`}}
						/>
					:
						<iframe
							className="blog_media_view_file"
							src={value.urls.source}
							title={value.filename}
						/>
					}
				</Box>
				<Box className="blog_media_view_details">
					<Box className="blog_media_view_details_left">
						<Typography>
							{_.details.filename}<br />
							{_.details.mime}<br />
							{_.details.size}<br />
							{value.image &&
								<React.Fragment>
									{_.details.dimensions}<br />
								</React.Fragment>
							}
							{value.image && value.image.thumbnails &&
								<React.Fragment>
									{_.details.thumbnails}&nbsp;
									<i
										className={"fa-solid fa-plus " +
											(thumb !== null ? ' open' : '')}
										onClick={() => thumb !== null ?
											thumbSet(null) : thumbAdd()}
									/>
								</React.Fragment>
							}
						</Typography>
					</Box>
					<Box className="blog_media_view_details_right">
						<Typography>
							<nobr>
								<i
									className="fa-solid fa-copy"
									onClick={() => {
										copy(value.urls.source).then(() => {
											events.get('success').trigger(_.url_copied)
										});
									}}
								/>
								<a
									href={value.urls.source}
									rel="noreferrer"
									target="_blank"
								>{value.filename}</a>
							</nobr><br />
							<nobr>{value.mime}</nobr><br />
							<nobr>{bytesHuman(value.length)}</nobr><br />
							{value.image &&
								<React.Fragment>
									<nobr>{`${value.image.resolution.width}x${value.image.resolution.height}`}</nobr><br />
								</React.Fragment>
							}
							{value.image && value.image.thumbnails && value.image.thumbnails.map(s =>
								<span key={s} className="blog_media_thumb">
									<i
										className="fa-solid fa-copy"
										onClick={() => {
											copy(value.urls[s]).then(() => {
												events.get('success').trigger(_.url_copied)
											});
										}}
									/>
									<a
										href={value.urls[s]}
										rel="noreferrer"
										target="_blank"
									>{s[0] === 'f' ? _.add.thumb.fit : _.add.thumb.crop} {s.substring(1)}</a>
									<ConfirmDelete
										onConfirm={() => thumbDelete(s)}
									/>
								</span>
							)}
						</Typography>
					</Box>
				</Box>
				{value.image &&
					<Box className="blog_media_upload_thumbs">
						{thumb !== null &&
							<Box className="blog_media_upload_thumb">
								<FormControl className="blog_thumb_type">
									<InputLabel id={value.key}>{_.add.thumb.type}</InputLabel>
									<Select
										label={_.add.thumb.type}
										labelId={value.key}
										onChange={ev => thumbChange('type', ev.target.value)}
										native
										size="small"
										value={thumb.type}
									>
										<option value="f">{_.add.thumb.fit}</option>
										<option value="c">{_.add.thumb.crop}</option>
									</Select>
								</FormControl>
								<TextField
									className="blog_thumb_dimension"
									InputProps={{ inputProps: { min: 1, max: value.image.resolution.width } }}
									label={_.add.thumb.width}
									onChange={ev => thumbChange('width', ev.target.value)}
									placeholder={_.add.thumb.width}
									size="small"
									type="number"
									value={thumb.width}
								/>
								<i
									className={'blog_thumb_chain fa-solid ' + (thumb.link ? 'fa-link' : 'fa-link-slash')}
									onClick={() => thumbChange('chain', !thumb.chain)}
								/>
								<TextField
									className="blog_thumb_dimension"
									InputProps={{ inputProps: { min: 1, max: value.image.resolution.height } }}
									label={_.add.thumb.height}
									onChange={ev => thumbChange('height', ev.target.value)}
									placeholder={_.add.thumb.height}
									size="small"
									type="number"
									value={thumb.height}
								/>
								<Button
									color="primary"
									onClick={thumbSubmit}
									variant="contained"
								>
									<i className="fa-solid fa-plus" />
								</Button>
								{err &&
									<Box className="error">{err}</Box>
								}
							</Box>
						}
					</Box>
				}
			</DialogContent>
		</Dialog>
	);
}

// Valid props
View.propTypes = {
	locale: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	onThumbAdded: PropTypes.func.isRequired,
	onThumbRemoved: PropTypes.func.isRequired,
	rights: PropTypes.exact({
		create: PropTypes.bool,
		delete: PropTypes.bool,
		read: PropTypes.bool,
		update: PropTypes.bool
	}).isRequired,
	value: PropTypes.object.isRequired
}