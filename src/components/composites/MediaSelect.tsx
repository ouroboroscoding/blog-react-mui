/**
 * Media Select
 *
 * Handles selecting the timeline or filename to fetch media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-03
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project modules
import Translation from '../../translations';

// Project components
import MediaFilter from './MediaFilter';

// Types
import type { MediaStruct } from './MediaFilter';
export type MediaSelectProps = {
	callback: (val: string) => void,
	current: string,
	onClose: () => void
}

/**
 * Media Select
 *
 * Handles UI to select media
 *
 * @name MediaSelect
 * @access public
 * @extends React.Component
 */
export default function MediaSelect(
	{ callback, current, onClose }: MediaSelectProps
) {

	// Text
	const _ = Translation.get().media_select;

	// State
	const [ images, imagesSet ] = useState<MediaStruct[] | false>(false);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');

	// Render
	return (
		<Dialog
			fullScreen={fullScreen}
			fullWidth={true}
			id="blog_post_media_select"
			maxWidth="lg"
			onClose={onClose}
			open={true}
		>
			<DialogTitle>{_.title}</DialogTitle>
			<DialogContent>
				<MediaFilter
					imagesOnly={true}
					onRecords={imagesSet}
				/>
				<br />
				{(images === false &&
					<DialogContentText>...</DialogContentText>
				) || ((images as MediaStruct[]).length === 0 &&
					<DialogContentText>{_.no_records}</DialogContentText>
				) ||
					<Box className="blog_post_media_select_records">
						{(images as MediaStruct[]).map(o =>
							<Paper
								className="blog_post_media_select_record"
								key={o._id}
							>
								<Box
									className="blog_post_media_select_record_image"
									style={{backgroundImage: `url(${o.urls.source})`}}
								/>
								<Box className="blog_post_media_select_record_urls">
									<Button
										color={o.urls.source === current ? 'info' : 'primary'}
										onClick={() => callback(o.urls.source)}
										variant="contained"
									>{_.source}</Button><br />
									{o.image && o.image.thumbnails.map(s =>
										<React.Fragment key={s}>
											<Button
												color={o.urls[s] === current ? 'info' : 'primary'}
												onClick={() => callback(o.urls[s])}
												variant="contained"
											>{s[0] === 'f' ? _.fit : _.crop} {s.substring(1)}</Button><br />
										</React.Fragment>
									)}
								</Box>
							</Paper>
						)}
					</Box>
				}
			</DialogContent>
		</Dialog>
	);
}

// Valid props
MediaSelect.propTypes = {
	callback: PropTypes.func.isRequired,
	current: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired
}