/**
 * Media
 *
 * Primary entry into media component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import clone from '@ouroboros/clone';
import { useRights } from '@ouroboros/brain-react';
import { timestamp } from '@ouroboros/dates';
import { afindi, arrayFindDelete, empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Local components
import Add from './Add';
import Filter from './Filter';
import View from './View';

// Translations
import TEXT from './text';

/**
 * Media
 *
 * Handles mapping of routers in types path
 *
 * @name Media
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Media({ locale, onError }) {

	// State
	const [ add, addSet ] = useState(false);
	const [ records, recordsSet ] = useState([]);
	const [ remove, removeSet ] = useState(null);
	const [ view, viewSet ] = useState(null);

	// Get rights
	const hover = useMediaQuery('(hover: hover)');
	const rights = useRights('blog_media');

	// Called to fetch records
	function fetch(filter) {

		// If it's empty
		if(empty(filter)) {
			recordsSet([]);
			return;
		}

		// If we have a range, convert it
		if(filter.range) {
			filter.range[0] = timestamp(filter.range[0] + ' 00:00:00', false);
			filter.range[1] = timestamp(filter.range[1] + ' 23:59:59', false);
		}

		// Fetch from the server
		recordsSet(false);
		blog.read('media/filter', filter).then(recordsSet, error => {
			onError(error);
		});
	}

	// Called after new media is uploaded
	function mediaAdded(file) {

		// Add it to the records
		recordsSet(l => {
			const lRecords = clone(l);
			lRecords.unshift(file);
			return lRecords;
		});

		// Hide the form
		addSet(false);
	}

	// Called when the user clicks on, or mouses in and out of the record item
	function mediaClick(media) {

		// If we can hover, do nothing
		if(hover) {
			return;
		}

		// Get latest
		recordsSet(l => {

			// Find the record
			const i = afindi(l, '_id', media._id);
			if(i === -1) {
				return l;
			}

			// Clone the records
			const lRecords = clone(l);

			// If we are already in hover move
			if(lRecords[i].hover) {
				delete lRecords[i].hover;
			} else {
				lRecords[i].hover = true;
			}

			// Set the new records
			return lRecords;
		});
	}

	// Called to delete the currently set `remove` media
	function mediaRemove() {

		// Send the delete request to the server
		blog.delete('media', {
			_id: remove._id
		}).then(data => {
			if(data) {
				recordsSet(l => arrayFindDelete(l, '_id', remove._id, true));
				removeSet(null);
			}
		}, error => {
			onError(error);
		});
	}

	// Called when the view has added a new thumbnail to the image
	function thumbAdded(size, url) {

		// Get latest
		recordsSet(l => {

			// Clone the records
			const lRecords = clone(l);

			// Find the record
			const i = afindi(lRecords, '_id', view._id);
			if(i === -1) {
				return l;
			}

			// Update the list of thumbnails
			lRecords[i].image.thumbnails.push(size);

			// Update the object of urls
			lRecords[i].urls[size] = url;

			// Set the new view
			viewSet(lRecords[i]);

			// Return the new records
			return lRecords;
		});
	}

	// Called when the view has removed an existing thumbnail from the image
	function thumbRemoved(size) {

		// Get latest
		recordsSet(l => {

			// Clone the records
			const lRecords = clone(l);

			// Find the record
			const i = afindi(lRecords, '_id', view._id);
			if(i === -1) {
				return l;
			}

			// Update the list of thumbnails
			const c = lRecords[i].image.thumbnails.indexOf(size)
			lRecords[i].image.thumbnails.splice(c, 1);

			// Update the object of urls
			delete lRecords[i].urls[size];

			// Set the new view
			viewSet(lRecords[i]);

			// Return the new records
			return lRecords;
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog_media">
			<Filter locale={locale} onChange={fetch} />
			{rights.create &&
				<Button
					className="blog_media_upload_button"
					color="primary"
					onClick={() => addSet(true)}
					variant="contained"
				>{_.add.title}</Button>
			}
			<Box className="blog_media_records">
				{(records === false &&
					<Box>
						<Typography>...</Typography>
					</Box>
				) || (records.length === 0 &&
					<Box>
						<Typography>{_.no_records}</Typography>
					</Box>
				) ||
					records.map(o =>
						<Paper
							className={'blog_media_records_item' + (o.hover ? ' hover' : '')}
							key={o._id}
							onClick={() => mediaClick(o)}
						>
							<Box className="blog_media_records_item_main">
								{o.image ?
									<Box
										className="blog_media_records_item_photo"
										style={{backgroundImage: `url(${o.urls.source})`}}
									/>
								:
									<Box className="blog_media_records_item_file">
										<i className="mime fa-solid fa-file" />
									</Box>
								}
								<Box className="blog_media_record_item_filename">
									<nobr><Typography>{o.filename}</Typography></nobr>
								</Box>
							</Box>
							{(hover || o.hover) &&
								<Box className="blog_media_records_item_buttons">
									<Button
										className="blog_media_records_item_view"
										color="primary"
										onClick={() => viewSet(o)}
										variant="contained"
									>
										<i className="fa-solid fa-eye" />
									</Button>
									{rights.delete &&
										<Button
											className="blog_media_records_item_delete"
											color="secondary"
											onClick={() => removeSet(o)}
											variant="contained"
										>
											<i className="fa-solid fa-trash-alt" />
										</Button>
									}
								</Box>
							}
						</Paper>
					)
				}
			</Box>
			{rights.create &&
				<Add
					locale={locale}
					onAdded={mediaAdded}
					onCancel={() => addSet(false)}
					onError={onError}
					open={add}
				/>
			}
			{remove !== null &&
				<Dialog
					id="blog_media_delete"
					onClose={() => removeSet(null)}
					open={true}
				>
					<DialogTitle>{_.remove.title.replace('{FILE}', remove.filename)}</DialogTitle>
					<DialogContent>
						<DialogContentText>{_.remove.confirm.replace('{FILE}', remove.filename)}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							color="secondary"
							onClick={mediaRemove}
							variant="contained"
						>{_.remove.button}</Button>
					</DialogActions>
				</Dialog>
			}
			{view !== null &&
				<View
					locale={locale}
					onClose={() => viewSet(null)}
					onError={onError}
					onThumbAdded={thumbAdded}
					onThumbRemoved={thumbRemoved}
					rights={rights}
					value={view}
				/>
			}
		</Box>
	);
}

// Valid props
Media.propTypes = {
	locale: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
}