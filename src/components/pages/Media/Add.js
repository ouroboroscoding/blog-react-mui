/**
 * Media Add
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import clone from '@ouroboros/clone';
import {
	afindi, arrayFindDelete, bytesHuman, merge, pathToTree
} from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Local components
import Upload from './Upload';

// Translations
import TEXT from '../../../translations/media';

/**
 * Media Add
 *
 * Handles uploading new media
 *
 * @name Add
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Add({ locale, onAdded, onCancel, onError, open }) {

	// State
	const [ errs, errsSet ] = useState({});
	const [ file, fileSet ] = useState(null);
	const [ thumbs, thumbsSet ] = useState([]);

	// Hooks
	const mobile = useMediaQuery('(max-width:400px)');

	// Called to add a thumbnail
	function thumbAdd() {
		thumbsSet(l => {
			const lThumbs = clone(l);
			lThumbs.push({
				key: uuidv4(),
				link: true,
				type: 'f',
				height: Math.round(file.dimensions.height / 2),
				width: Math.round(file.dimensions.width / 2)
			});
			return lThumbs;
		});
	}

	// Called when a thumbnail changes
	function thumbChange(key, type, val) {

		// Make sure we're up to date
		thumbsSet(l => {

			// Clone the thumbs
			const lThumbs = clone(l);

			// Find the record
			const iThumb = afindi(l, 'key', key);

			// If it doesn't exist, do nothing
			if(iThumb === -1) {
				return l;
			}

			// Init new values
			const o = { }

			// If we're changing the height or width
			if(type === 'height' || type === 'width') {

				// Make sure we have an int
				val = parseInt(val, 10);

				// If it's higher than it's equivalent file dimension, set it to
				//	that
				if(val > file.dimensions[type]) {
					val = file.dimensions[type];
				}

				// If we're linked
				if(lThumbs[iThumb].link) {

					// If we're changing the height
					if(type === 'height') {

						// Get the percentage of the height based on the image height
						const fPerc = file.dimensions.height / val;

						// Set new values
						o.width = Math.round(file.dimensions.width / fPerc);
					}

					// Else, if we're changing the width
					else {

						// Get the percentage of the height based on the image height
						const fPerc = file.dimensions.width / val;

						// Set new values
						o.height = Math.round(file.dimensions.height / fPerc);
					}
				}
			}

			// Add the new value
			o[type] = val;

			// Merge the new data and return
			merge(lThumbs[iThumb], o);
			return lThumbs;
		});
	}

	// Called to remove a thumbnail
	function thumbRemove(key) {
		thumbsSet(l => arrayFindDelete(l, 'key', key, true));
	}

	// Called when the photo changes
	function uploadChange(upload) {

		// Split the URL
		const lData = upload.url.split(';');

		// Change the data
		fileSet({
			data: lData[1].substring(7),
			dimensions: upload.file.dimensions,
			name: upload.file.name.replace(/ /g, '_'),
			mime: upload.file.type,
			length: upload.file.size,
			type: upload.file.type,
			url: upload.url
		});
	}

	// Called to upload the file
	function uploadSubmit() {

		// Clear errors
		errsSet({});

		// Generate the data
		const oData = {
			base64: file.data,
			filename: file.name
		};

		// If we have thumbs
		if(thumbs.length) {

			// Generate the string for each thumb
			oData.thumbnails = thumbs.map(o =>
				`${o.type}${o.width}x${o.height}`
			);
		}

		// Make the request to the server
		blog.create('admin/media', oData).then(data => {

			// Pass along the data tp the parent
			onAdded(data);

			// Clear the local data
			fileSet(null);
			thumbsSet([]);

		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				errsSet(pathToTree(error.msg));
			} else if(error.code === errors.body.DB_DUPLICATE) {
				errsSet({ duplicate: true });
			} else {
				onError(error);
			}
		});
	}

	// Text
	const _ = TEXT[locale]

	// Render
	return (
		<Dialog
			fullScreen={mobile}
			id="blog_media_upload_modal"
			onClose={onCancel}
			open={open}
		>
			<DialogTitle>{_.add.title}</DialogTitle>
			<DialogContent>
				<Upload
					maxFileSize={10485760}
					onChange={uploadChange}
					value={file}
				>
					{({ uploadFile, uploadClick, uploadDragProps }) => (
						uploadFile ? (
							<Box className="blog_media_upload">
								{(uploadFile.type === 'image/jpeg' || uploadFile.type === 'image/png') ? (
									<Box className="blog_media_upload_photo" style={{backgroundImage: `url(${uploadFile.url})`}}>
										<i className="fas fa-times-circle close" onClick={() => { fileSet(null); thumbsSet([]); }} />
									</Box>
								) : (
									<Box className="blog_media_upload_photo">
										<i className="fas fa-times-circle close" onClick={() => { fileSet(null); thumbsSet([]); }} />
										<i className="mime fa-solid fa-file" />
									</Box>
								)}
								<Box className="blog_media_upload_details">
									<Box className="blog_media_upload_details_left">
										<Typography>
											{_.details.filename}<br />
											{_.details.mime}<br />
											{_.details.size}<br />
											{uploadFile.dimensions && [
												_.details.dimensions,
												<br />
											]}
										</Typography>
									</Box>
									<Box className="blog_media_upload_details_right">
										<Typography>
											{uploadFile.name}<br />
											{uploadFile.type}<br />
											{bytesHuman(uploadFile.length)}<br />
											{uploadFile.dimensions && [
												`${uploadFile.dimensions.width}x${uploadFile.dimensions.height}`,
												<br />
											]}
										</Typography>
									</Box>
								</Box>
								{['image/jpeg', 'image/png'].includes(file.type) &&
									<Box className="blog_media_upload_thumbs">
										<Box className="blog_media_upload_details">
											<Box className="blog_media_upload_details_left">
												<Typography>{_.details.thumbnails}</Typography>
											</Box>
											<Box className="blog_media_upload_details_right">
												<i className="fa-solid fa-plus link" onClick={thumbAdd} />
											</Box>
										</Box>
										{thumbs && thumbs.map(o =>
											<Box key={o.key} className="blog_media_upload_thumb">
												<FormControl className="blog_thumb_type">
													<InputLabel id={o.key}>{_.add.thumb.type}</InputLabel>
													<Select
														label={_.add.thumb.type}
														labelId={o.key}
														onChange={ev => thumbChange(o.key, 'type', ev.target.value)}
														native
														size="small"
														value={o.type}
													>
														<option value="f">{_.add.thumb.fit}</option>
														<option value="c">{_.add.thumb.crop}</option>
													</Select>
												</FormControl>
												<TextField
													className="blog_thumb_dimension"
													InputProps={{ inputProps: { min: 1, max: file.dimensions.width } }}
													label={_.add.thumb.width}
													onChange={ev => thumbChange(o.key, 'width', ev.target.value)}
													placeholder={_.add.thumb.width}
													size="small"
													type="number"
													value={o.width}
												/>
												<i
													className={'blog_thumb_link fa-solid ' + (o.link ? 'fa-link' : 'fa-link-slash')}
													onClick={() => thumbChange(o.key, 'link', !o.link)}
												/>
												<TextField
													className="blog_thumb_dimension"
													InputProps={{ inputProps: { min: 1, max: file.dimensions.height } }}
													label={_.add.thumb.height}
													onChange={ev => thumbChange(o.key, 'height', ev.target.value)}
													placeholder={_.add.thumb.height}
													size="small"
													type="number"
													value={o.height}
												/>
												<i
													className="blog_thumb_remove fa-solid fa-trash-alt"
													onClick={() => thumbRemove(o.key)}
												/>
												<br />
											</Box>
										)}
									</Box>
								}
								{errs.duplicate &&
									<Typography className="error">{_.add.duplicate}</Typography>
								}
							</Box>
						) : (
							<React.Fragment>
								<Box className="blog_media_upload_text link" onClick={uploadClick} {...uploadDragProps}>
									<Typography className="link">
										{_.add.descr}
									</Typography>
								</Box>
							</React.Fragment>
						)
					)}
				</Upload>
			</DialogContent>
			<DialogActions>
				<Button
					color="secondary"
					onClick={onCancel}
					variant="contained"
				>{_.add.cancel}</Button>
				{file &&
					<Button
						color="primary"
						onClick={uploadSubmit}
						variant="contained"
					>{_.add.upload}</Button>
				}
			</DialogActions>
		</Dialog>
	);
}

// Valid props
Add.propTypes = {
	locale: PropTypes.string.isRequired,
	onAdded: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired
}