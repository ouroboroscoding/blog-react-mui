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
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project components
import HTML from '../../elements/HTML';
import Tags from '../../elements/Tags';

// Project modules
import categoryTitle from '../../../functions/categoryTitle';
import titleToSlug from '../../../functions/titleToSlug';

// Translations
import TEXT from '../../../translations/new_post';

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
export default function New({ baseURL, locale, onError }) {

	// State
	const [ cats, catsSet ] = useState(false);
	const [ data, dataSet ] = useState({
		categories: [], slug: '', title: ''
	});
	const [ error, errorSet ] = useState({});
	const [ loc, locSet ] = useState(false);
	const [ locales, localesSet ] = useState(false);
	const [ menu, menuSet ] = useState(false);

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

	}, [ locale, onError ]);

	// Called when any data point changes
	function dataChange(which, value) {
		dataSet(o => {
			const oData = { ...data };
			oData[which] = value;
			if(which === 'title') {
				oData.slug = titleToSlug(value);
			}
			return oData;
		});
	}

	// Called when a category is changes
	function catChange(_id, checked) {
		dataSet(o => {
			const oData = { ...data }
			if(checked) {
				const i = oData.categories.indexOf(_id);
				if(i === -1) {
					oData.categories.push(_id);
				}
			} else {
				const i = oData.categories.indexOf(_id);
				if(i > -1) {
					oData.categories.splice(i, 1);
				}
			}
			return oData;
		})
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog_new_post">
			<Box className="blog_new_post_content">
				<HTML
					error={'content' in error ? error.content : false}
					fullScreen={fullScreen}
					locale={locale}
					onError={onError}
					ref={refHtml}
				/>
			</Box>
			{fullScreen &&
				<Box className={'blog_new_post_drawer_icon' + (menu ? ' open' : '')}>
					<IconButton onClick={() => menuSet(b => !b)}>
						<i className="fa-solid fa-bars" />
					</IconButton>
				</Box>
			}
			<Box className={'blog_new_post_drawer' + (menu ? ' open' : '')}>
				{(cats === false || locales === false) ?
					<Typography>...</Typography>
				:
					<React.Fragment>
						{locales.length > 1 &&
							<Box className="field">
								<FormControl error={'_locale' in error}>
									<InputLabel id="blog_new_post_locale_select">
										{_.labels.language}
									</InputLabel>
									<Select
										label={_.labels.language}
										labelId="blog_new_post_locale_select"
										native
										onChange={ev => locSet(ev.target.value)}
										size={fullScreen ? 'small' : 'medium'}
										value={loc}
										variant="outlined"
									>
										{locales.map(o =>
											<option key={o._id} value={o._id}>{o.name}</option>
										)}
									</Select>
									{'_locale' in error &&
										<FormHelperText>{error._locale}</FormHelperText>
									}
								</FormControl>
							</Box>
						}
						<Box className="field">
							<TextField
								InputLabelProps={{
									shrink: true,
								}}
								label={_.labels.title}
								onChange={ev => dataChange('title', ev.currentTarget.value)}
								placeholder={_.placeholders.title}
								size={fullScreen ? 'small' : 'medium'}
								value={data.title}
							/>
						</Box>
						<Box className="field">
							<TextField
								InputProps={{
									startAdornment:
										<InputAdornment position="start">
											{`${baseURL}/p/`}
										</InputAdornment>
								}}
								label={_.labels.slug}
								onChange={ev => dataChange('slug', ev.currentTarget.value)}
								size={fullScreen ? 'small' : 'medium'}
								value={data.slug}
							/>
						</Box>
						<Box className="field">
							<Box className="field_group">
								<Typography className="legend">{_.labels.categories}</Typography>
								{cats.map(o =>
									<Box className="category">
										<FormControlLabel
											control={
												<Switch
													checked={data.categories.includes(o._id)}
													onChange={ev => catChange(o._id, ev.target.checked)}
												/>
											}
											label={categoryTitle(locale, o)}
										/>
									</Box>
								)}
							</Box>
						</Box>
						<Box className="field">
							<Tags
								error={'tags' in error ? error.tags : false}
								label={_.labels.tags}
								placeholder={_.placeholders.tags}
								ref={refTags}
							/>
						</Box>
					</React.Fragment>
				}
			</Box>
		</Box>
	);
}

// Valid props
New.propTypes = {
	baseURL: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
}