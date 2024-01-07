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
import HTML from '../elements/HTML';
import Meta from '../composites/Meta';
import Tags from '../elements/Tags';

// Project modules
import localeTitle from '../../functions/localeTitle';
import titleToSlug from '../../functions/titleToSlug';
import Translation from '../../translations';

// Types
import type { MetaKey, MetaStruct } from '../composites/Meta';
import type { CategoryStruct } from './Categories';
import type { LocaleStruct } from '../../types';
export type NewProps = {
	allowedMeta: MetaKey[],
	basePath: string,
	baseURL: string
}
type NewData = {
	categories: string[],
	locale: string,
	slug: string,
	title: string,
	meta: MetaStruct,
	tags: string[]
}
type NewDataKeys = keyof NewData;

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
export default function New({ allowedMeta, basePath, baseURL }: NewProps) {

	// Text
	const _ = Translation.get().new;

	// State
	const [ cats, catsSet ] = useState<CategoryStruct[] | false>(false);
	const [ data, dataSet ] = useState<NewData>({
		categories: [],
		locale: Translation.locale(),
		slug: '',
		title: '',
		meta: {},
		tags: []
	});
	const [ error, errorSet ] = useState<Record<string, any>>({});
	const [ locales, localesSet ] = useState<LocaleStruct[] | false>(false);
	const [ menu, menuSet ] = useState(false);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');
	const navigate = useNavigate();

	// Refs
	const refHtml = useRef<HTML>(null);

	// Load effect
	useEffect(() => {

		// Get the available categories
		blog.read('admin/category').then(
			catsSet,
			err => events.get('error').trigger(err)
		);

		// Subscribe to locales
		const oL = Locales.subscribe(l => {

			// Do nothing until we get real data
			if(empty(l)) return;

			// If we don't have the locale in the locales, just use the first
			//	one in the list
			if(!afindo(l, '_id', Translation.locale())) {
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

	}, [ ]);

	// Called when a category is changes
	function catChange(_id: string, checked: boolean) {
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
		const oData: Record<string, any> = {
			categories: data.categories,
			locales: {
				[data.locale]: {
					content: '',
					title: data.title.trim(),
					slug: data.slug.trim(),
					tags: [ ...data.tags ]
				}
			}
		};
		const oErrors: Record<string, any> = {};

		// Check the title
		if(oData.locales[data.locale].title === '') {
			oErrors.title = 'missing';
		}

		// Check the slug
		if(oData.locales[data.locale].slug === '') {
			oErrors.slug = 'missing';
		}

		// Add the content and check if it's empty
		oData.locales[data.locale].content = (refHtml.current as HTML).value;
		if(empty(oData.locales[data.locale].content)) {
			oErrors.content = 'missing';
		}

		// If there were any errors
		if(!empty(oErrors)) {
			errorSet(oErrors);
			return;
		}

		// Send the data to the server
		blog.create('admin/post', oData).then(_id => {
			if(_id) {
				navigate(`${basePath}/edit/${_id}`);
			}
		}, err => {
			if(err.code === errors.body.DATA_FIELDS) {
				errorSet(pathToTree(err.msg));
			} else if(err.code === errors.body.DB_DUPLICATE) {
				errorSet({'slug': 'duplicate'});
			} else {
				events.get('error').trigger(err);
			}
		});
	}

	// Called when any data point changes
	function dataChange(which: NewDataKeys, value: any) {
		dataSet(o => {
			const oData = { ...o };
			oData[which] = value;
			if(which === 'title') {
				oData.slug = titleToSlug(value);
			}
			return oData;
		});
	}

	// Render
	return (
		<Box id="blog_new_post">
			<Box className="blog_new_post_content">
				<HTML
					error={'content' in error ? error.content : false}
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
														checked={data.categories.includes(o._id as string)}
														onChange={ev => catChange(o._id as string, ev.target.checked)}
													/>
												}
												label={localeTitle(o)}
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
								allowed={allowedMeta}
								errors={'meta' in error ? error.meta : {}}
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
	allowedMeta: PropTypes.arrayOf(PropTypes.string).isRequired,
	basePath: PropTypes.string.isRequired,
	baseURL: PropTypes.string.isRequired
}