/**
 * New Post
 *
 * Holds the component for creating a new blog post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-16
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import { locales as Locales } from '@ouroboros/mouth-mui';
import { afindo, empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project components
import HTML from '../../composites/HTML';
import Tags from '../../composites/Tags';

// Translations
import TEXT from '../../../translations/new_post';
import categoryTitle from 'blog/functions/categoryTitle';

/**
 * New
 *
 * Handles the New component for creating a blog post
 *
 * @name New
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function New({ locale, onError }) {

	// State
	const [ cats, catsSet ] = useState(false);
	const [ error, errorSet ] = useState({});
	const [ loc, locSet ] = useState(false);
	const [ locales, localesSet ] = useState(false);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');

	// Refs
	const refHtml = useRef(null);
	const refTags = useRef(null);

	// Load effect
	useEffect(() => {

		// Get the available categories
		blog.read('admin/category').then(catsSet, onError);

		// Subscribe to locales
		const oL = Locales.subscribe(l => {

			// Do nothing until we get real data
			if(empty(l)) return;

			// If we have the locale in the locales, use it as the default for
			//	the first post
			const o = afindo(l, '_id', locale);
			if(o) {
				locSet(o._id);
			}

			// Else, just use the first one we find
			else {
				locSet(l[0]._id);
			}

			// Set the locales
			localesSet(l);
		});

		// Unsubscribe
		return () => {
			oL.unsubscribe();
		}
	}, []);

	// Text
	const _ = TEXT[locale];

	// Header grid sizes
	const oHeaderGS = locales.length > 1 ? { xs: 12, md: 6 } : { xs: 12 };

	// Render
	return (
		<Box id="blog_new_post">
			<Box className="blog_new_post_header">
				{(cats === false || locales === false) ?
					<Typography>...</Typography>
				:
					<Grid container spacing={1}>
						{locales.length > 1 &&
							<Grid item {...oHeaderGS}>
								<FormControl error={'_locale' in error}>
									<InputLabel id="blog_new_post_locale_select">
										{_.labels.language}
									</InputLabel>
									<Select
										label={_.labels.language}
										labelId="blog_new_post_locale_select"
										native
										onChange={ev => locSet(ev.target.value)}
										size="small"
										value={loc}
										variant="outlined"
									>
										{locales.map(o =>
											<option key={o._id} value={o._id}>{o.name}</option>
										)}
									</Select>
								</FormControl>
								{'_locale' in error &&
									<FormHelperText>{error._locale}</FormHelperText>
								}
							</Grid>
						}
						<Grid item {...oHeaderGS}>
							<FormControl error={'category' in error}>
								<InputLabel id="blog_new_post_category_select">
									{_.labels.category}
								</InputLabel>
								<Select
									label={_.labels.category}
									labelId="blog_new_post_category_select"
									native
									size="small"
									variant="outlined"
								>
									{cats.map(o =>
										<option key={o._id} value={o._id}>{categoryTitle(locale, o)}</option>
									)}
								</Select>
								{'category' in error &&
									<FormHelperText>{error.category}</FormHelperText>
								}
							</FormControl>
						</Grid>
					</Grid>
				}
			</Box>
			<Box className="blog_new_post_content">
				<HTML
					error={'content' in error ? error.content : false}
					fullScreen={fullScreen}
					locale={locale}
					onError={onError}
					ref={refHtml}
				/>
			</Box>
			<Box className="blog_new_post_footer">
				<Tags
					error={'tags' in error ? error.tags : false}
					ref={refTags}
				/>
			</Box>
		</Box>
	);
}

// Valid props
New.propTypes = {
	locale: PropTypes.string,
	onError: PropTypes.func
}