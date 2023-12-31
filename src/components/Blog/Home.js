/**
 * Home
 *
 * Home page of blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-28
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
import TEXT from '../../translations/home';

/**
 * Home
 *
 * Handles mapping of routers in types path
 *
 * @name Home
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Home({ basePath, locale }) {

	// State
	const [ categories, categoriesSet ] = useState(false);
	const [ remove, removeSet ] = useState(null);
	const [ unpublished, unpublishedSet ] = useState(false);

	// Hooks
	const rights = useRights('blog_post');

	// Load effect
	useEffect(() => {

		// Fetch unpublished
		blog.read('__list', [
			'admin/category',
			'admin/post/unpublished'
		]).then(data => {
			if(data) {
				categoriesSet(data[0][1].data);
				unpublishedSet(data[1][1].data);
			}

		}, error => events.get('error').trigger(error));

	}, []);

	// Called to delete the currently set `remove` post
	function postRemove() {

		// Send the delete request to the server
		blog.delete('admin/post', {
			_id: remove._id
		}).then(data => {
			if(data) {
				unpublishedSet(l => arrayFindDelete(l, '_id', remove._id, true));
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
		<Box id="blog_home">
			<Typography>{_.message}</Typography>
			{unpublished.length > 0 &&
				<Box className="blog_home_unpublished">
					<Typography variant="h3">{_.unpublished.title}</Typography>
					{unpublished !== false && unpublished.length > 0 &&
						<Grid container spacing={2}>
							{unpublished.map(o =>
								<Grid key={o._id} item xs={12} md={6} lg={4} xl={3}>
									<Paper className="blog_home_unpublished_post">
										<Box className="unpublished_post_text">
											<Typography className="post_title">{localeTitle(locale, o)}</Typography>
											<Typography></Typography>
										</Box>
										<Box className="unpublished_post_actions">
											{rights.update &&
												<Link to={`${basePath}/edit/${o._id}`}>
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
				</Box>
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
Home.propTypes = {
	basePath: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired
}