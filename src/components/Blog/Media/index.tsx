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
import { copy } from '@ouroboros/browser/clipboard';
import events from '@ouroboros/events';
import { afindi, arrayFindDelete } from '@ouroboros/tools';

// NPM modules
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

// Project modules
import Translation from '../../../translations';

// Local components
import Add from './Add';
import Filter from '../../composites/MediaFilter';
import View from './View';

// Types
import type { MediaStruct } from '../../composites/MediaFilter';
export type ThumbStruct = {
	key?: string,
	type: 'f' | 'c',
	height: number,
	chain: boolean,
	width: number
}

/**
 * Media
 *
 * Handles fetching and display of media
 *
 * @name Media
 * @access public
 * @returns React.Component
 */
export default function Media() {

	// Text
	const _ = Translation.get().media;

	// State
	const [ add, addSet ] = useState<boolean>(false);
	const [ records, recordsSet ] = useState<MediaStruct[] | false>(false);
	const [ remove, removeSet ] = useState<MediaStruct | null>(null);
	const [ view, viewSet ] = useState<MediaStruct | null>(null);

	// Get rights
	const hover = useMediaQuery('(hover: hover)');
	const rights = useRights('blog_media');

	// Called after new media is uploaded
	function mediaAdded(file: MediaStruct) {

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
	function mediaClick(media: MediaStruct) {

		// If we can hover, do nothing
		if(hover) {
			return;
		}

		// Get latest
		recordsSet(l => {

			// Find the record
			const i = afindi(l as MediaStruct[], '_id', media._id);
			if(i === -1) {
				return l;
			}

			// Clone the records
			const lRecords = clone(l);

			// If we are already in hover mode
			if(lRecords[i]._hover) {
				delete lRecords[i]._hover;
			} else {
				lRecords[i]._hover = true;
			}

			// Set the new records
			return lRecords;
		});
	}

	// Called to delete the currently set `remove` media
	function mediaRemove() {

		// Send the delete request to the server
		blog.delete('admin/media', {
			_id: (remove as MediaStruct)._id
		}).then(data => {
			if(data) {
				recordsSet(l => arrayFindDelete(l as MediaStruct[], '_id', (remove as MediaStruct)._id, true) as MediaStruct[]);
				removeSet(null);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Called when the view has added a new thumbnail to the image
	function thumbAdded(size: string, url: string) {

		// Get latest
		recordsSet(l => {

			// Clone the records
			const lRecords = clone(l);

			// Find the record
			const i = afindi(lRecords, '_id', (view as MediaStruct)._id);
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
	function thumbRemoved(size: string) {

		// Get latest
		recordsSet(l => {

			// Clone the records
			const lRecords = clone(l);

			// Find the record
			const i = afindi(lRecords, '_id', (view as MediaStruct)._id);
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

	// Render
	return (
		<Box id="blog_media">
			<Filter
				onRecords={recordsSet}
			/>
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
				) || ((records as MediaStruct[]).length === 0 &&
					<Box>
						<Typography>{_.no_records}</Typography>
					</Box>
				) ||
					(records as MediaStruct[]).map(o =>
						<Paper
							className={'blog_media_records_item' + (o._hover ? ' hover' : '')}
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
									<span className="nobr"><Typography>{o.filename}</Typography></span>
								</Box>
							</Box>
							{(hover || o._hover) &&
								<Box className="blog_media_records_item_buttons">
									<Button
										className="blog_media_records_item_view"
										color="primary"
										onClick={() => viewSet(o)}
										variant="contained"
									>
										<i className="fa-solid fa-eye" />
									</Button>
									<Button
										className="blog_media_records_item_copy"
										color="info"
										onClick={() => {
											copy(o.urls.source).then(() => {
												events.get('success').trigger(_.url_copied)
											});
										}}
										variant="contained"
									>
										<i className="fa-solid fa-copy" />
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
					onAdded={mediaAdded}
					onCancel={() => addSet(false)}
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
					onClose={() => viewSet(null)}
					onThumbAdded={thumbAdded}
					onThumbRemoved={thumbRemoved}
					rights={rights}
					value={view}
				/>
			}
		</Box>
	);
}