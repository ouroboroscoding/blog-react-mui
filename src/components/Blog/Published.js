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

// Styling
import '../../sass/blog.scss';

// Translations
import TEXT from '../../translations/published';

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
export default function Published({ basePath, locale }) {

	// State
	const [ categories, categoriesSet ] = useState(false);
	const [ published, publishedSet ] = useState(false);
	const [ remove, removeSet ] = useState(null);

	// Hooks
	const rights = useRights('blog_post');

	// Load effect
	useEffect(() => {

		// Fetch published
		blog.read('__list', [
			'admin/category',
			'admin/posts'
		]).then(data => {
			if(data) {
				categoriesSet(data[0][1].data);
				publishedSet(data[1][1].data);
			}

		}, error => events.get('error').trigger(error));

	}, []);

	// Called to delete the currently set `remove` post
	function postRemove() {

		// Send the delete request to the server
		blog.delete('admin/post', {
			_id: remove._raw
		}).then(data => {
			if(data) {
				publishedSet(l => arrayFindDelete(l, '_raw', remove._raw, true));
				removeSet(null);
				events.get('success').trigger(TEXT[locale].remove.success);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog_published">
			{published !== false && published.length > 0 &&
				<Grid container spacing={2}>
					{published.map(o =>
						<Grid key={o._lug} item xs={12} md={6} lg={4} xl={3}>
							<Paper className="blog_post">
								<Box className="post_text">
									<Typography className="post_title">{localeTitle(locale, o)}</Typography>
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
					<DialogTitle>{_.remove.title.replace('{TITLE}', localeTitle(locale, remove))}</DialogTitle>
					<DialogContent>
						<DialogContentText>{_.remove.confirm.replace('{TITLE}', localeTitle(locale, remove))}</DialogContentText>
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
	basePath: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired
}