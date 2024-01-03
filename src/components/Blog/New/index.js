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
import blog, { errors } from '@ouroboros/blog';
import { locales as Locales } from '@ouroboros/mouth-mui';
import events from '@ouroboros/events';
import { afindo, empty, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import Meta from '../../composites/Meta';
import Tags from '../../elements/Tags';

// Project modules
import localeTitle from '../../../functions/localeTitle';
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
export default function New({ basePath, baseURL, locale }) {

	// State
	const [ cats, catsSet ] = useState(false);
	const [ data, dataSet ] = useState({
		categories: [], locale: locale, slug: '', title: '', meta: {}
	});
	const [ error, errorSet ] = useState({});
	const [ locales, localesSet ] = useState(false);
	const [ menu, menuSet ] = useState(false);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');
	const navigate = useNavigate();

	// Refs
	const refHtml = useRef(null);

	// Load effect
	useEffect(() => {

		// Get the available categories
		blog.read('admin/category').then(
			catsSet,
			error => events.get('error').trigger(error)
		);

		// Subscribe to locales
		const oL = Locales.subscribe(l => {

			// Do nothing until we get real data
			if(empty(l)) return;

			// If we don't have the locale in the locales, just use the first
			//	one in the list
			const o = afindo(l, '_id', locale);
			if(!o) {
				dataSet(o => {
					const oData = { ...o };
					oData.locale = l[0]._id;
					return oData;
				});
			}

			// Set the locales
			localesSet(l);
		});

		// Unsubscribe
		return () => {
			oL.unsubscribe();
		}

	}, [ locale ]);

	// Called when a category is changes
	function catChange(_id, checked) {
		dataSet(o => {
			const oData = { ...o }
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

	// Called to create the new post
	function create() {

		// Init data and possible errors
		const oData = {
			categories: data.categories,
			locales: {
				[data.locale]: {
					title: data.title.trim(),
					slug: data.slug.trim(),
				}
			}
		};
		const oErrors = {};

		// Check the title
		if(oData.locales[data.locale].title === '') {
			oErrors.title = 'missing';
		}

		// Check the slug
		if(oData.locales[data.locale] === '') {
			oErrors.slug = 'missing';
		}

		// Add the content and check if it's empty
		oData.locales[data.locale].content = refHtml.current.value;
		if(empty(oData.locales[data.locale].content)) {
			oErrors.content = 'missing';
		}

		// If there were any errors
		if(!empty(oErrors)) {
			errorSet(oErrors);
			return;
		}

		// If we have any tags, add them
		if(data.tags.length) {
			oData.locales[data.locale].tags = [ ...data.tags ];
		}

		// Send the data to the server
		blog.create('admin/post', oData).then(_id => {
			if(_id) {
				navigate(`${basePath}/edit/${_id}`);
			}
		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				errorSet(pathToTree(error.msg));
			} else if(error.code === errors.body.DB_DUPLICATE) {
				errorSet({'slug': 'duplicate'});
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Called when any data point changes
	function dataChange(which, value) {
		dataSet(o => {
			const oData = { ...o };
			oData[which] = value;
			if(which === 'title') {
				oData.slug = titleToSlug(value);
			}
			return oData;
		});
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
					ref={refHtml}
				/>
			</Box>
			{fullScreen &&
				<Box className={'blog_new_post_drawer_icon' + (menu ? ' drawer_open' : '')}>
					<IconButton onClick={() => menuSet(b => !b)}>
						<i className="fa-solid fa-bars" />
					</IconButton>
				</Box>
			}
			<Box className={'blog_new_post_drawer' + (menu ? ' drawer_open' : '')}>
				{(cats === false || locales === false) ?
					<Typography>...</Typography>
				:
					<React.Fragment>
						<Box className="blog_new_post_drawer_fields">
							<Box className="field">
								<Box className="field_group">
									<Typography className="legend">{_.labels.categories}</Typography>
									{cats.map(o =>
										<Box className="category" key={o._id}>
											<FormControlLabel
												control={
													<Switch
														checked={data.categories.includes(o._id)}
														onChange={ev => catChange(o._id, ev.target.checked)}
													/>
												}
												label={localeTitle(locale, o)}
											/>
										</Box>
									)}
								</Box>
							</Box>
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
											onChange={ev => dataChange('locale', ev.target.value)}
											size={fullScreen ? 'small' : 'medium'}
											value={data.locale}
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
									error={'title' in error}
									helperText={error.title || ''}
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
									error={'slug' in error}
									helperText={error.slug || ''}
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
								<Tags
									error={'tags' in error ? error.tags : false}
									label={_.labels.tags}
									onChange={val => dataChange('tags', val)}
									placeholder={_.placeholders.tags}
									value={data.tags}
								/>
							</Box>
							<Meta
								errors={'meta' in error ? error.meta : {}}
								locale={locale}
								onChange={val => dataChange('meta', val)}
								value={data.meta || {}}
							/>
						</Box>
						<Box className="blog_new_post_drawer_actions">
							<Button
								color="primary"
								disabled={data.title.trim() === '' || data.slug.trim() === ''}
								onClick={create}
								variant="contained"
							>{_.submit}</Button>
						</Box>
					</React.Fragment>
				}
			</Box>
		</Box>
	);
}

// Valid props
New.propTypes = {
	basePath: PropTypes.string.isRequired,
	baseURL: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired
}