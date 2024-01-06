/**
 * Published
 *
 * Published page of blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-02
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import { useRights } from '@ouroboros/brain-react';
import events from '@ouroboros/events';
import { arrayFindDelete } from '@ouroboros/tools'

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Project functions
import localeTitle from '../../functions/localeTitle';
import Translation from '../../translations';

// Styling
import '../../sass/blog.scss';

// Types
export type PublishedProps = {
	basePath: string
}
interface RecordType {
	_raw: string,
	locales: Record<string, any>
}

/**
 * Published
 *
 * Handles mapping of routers in types path
 *
 * @name Published
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Published({ basePath }: PublishedProps) {

	// Text
	const _ = Translation.get().published;

	// State
	const [ published, publishedSet ] = useState<RecordType[] | false>(false);
	const [ remove, removeSet ] = useState<RecordType | null>(null);

	// Hooks
	const rights = useRights('blog_post');

	// Load effect
	useEffect(() => {

		// Fetch published
		blog.read('admin/posts').then(data => {
			if(data) {
				publishedSet(data);
			}

		}, error => events.get('error').trigger(error));

	}, []);

	// Called to delete the currently set `remove` post
	function postRemove() {

		// Send the delete request to the server
		blog.delete('admin/post', {
			_id: (remove as RecordType)._raw
		}).then(data => {
			if(data) {
				publishedSet(l => arrayFindDelete(l as RecordType[], '_raw', (remove as RecordType)._raw, true) as RecordType[]);
				removeSet(null);
				events.get('success').trigger(_.remove.success);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Render
	return (
		<Box id="blog_published">
			{published !== false && published.length > 0 &&
				<Grid container spacing={2}>
					{published.map(o =>
						<Grid key={o._raw} item xs={12} md={6} lg={4} xl={3}>
							<Paper className="blog_post">
								<Box className="post_text">
									<Typography className="post_title">{localeTitle(o)}</Typography>
									<Typography></Typography>
								</Box>
								<Box className="post_actions">
									{rights.update &&
										<Link to={`${basePath}/edit/${o._raw}`}>
											<i className="fa-solid fa-edit" />
										</Link>
									}
									{rights.delete &&
										<i
											className="fa-solid fa-trash-alt"
											onClick={() => removeSet(o)}
										/>
									}
								</Box>
							</Paper>
						</Grid>
					)}
				</Grid>
			}
			{remove !== null &&
				<Dialog
					id="blog_post_delete"
					onClose={() => removeSet(null)}
					open={true}
				>
					<DialogTitle>{_.remove.title.replace('{TITLE}', localeTitle(remove))}</DialogTitle>
					<DialogContent>
						<DialogContentText>{_.remove.confirm.replace('{TITLE}', localeTitle(remove))}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							color="secondary"
							onClick={postRemove}
							variant="contained"
						>{_.remove.button}</Button>
					</DialogActions>
				</Dialog>
			}
		</Box>
	);
}

// Valid props
Published.propTypes = {
	basePath: PropTypes.string.isRequired
}