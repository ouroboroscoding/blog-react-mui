/**
 * Edit Post
 *
 * Holds the component for updated or adding to an existing post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-23
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { useRights } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import { timestamp } from '@ouroboros/dates';
import events from '@ouroboros/events';
import { locales as Locales } from '@ouroboros/mouth-mui';
import {
	afindo, arrayFindDelete, compare, empty, isObject, omap, pathToTree
} from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
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
export type EditProps = {
	_id: string,
	allowedMeta: MetaKey[],
	baseURL: string
}
type PostLocaleStruct = {
	title: string,
	slug: string,
	content: string,
	tags: string[],
	meta: MetaStruct
}
type PostStruct = {
	_id: string,
	_created: number,
	_updated: number,
	last_published: number,
	categories: string[],
	locales: Record<string, PostLocaleStruct>
}
type NewLangStruct = { locale: string } & PostLocaleStruct

/**
 * Edit
 *
 * Handles the Edit component for updated a blog post
 *
 * @name Edit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Edit({ _id, allowedMeta, baseURL }: EditProps) {

	// Text
	const _ = Translation.get().edit;

	// State
	const [ cats, catsSet ] = useState<CategoryStruct[] | false>(false);
	const [ error, errorSet ] = useState<Record<string, any>>({});
	const [ loc, locSet ] = useState<string | false>(false);
	const [ locales, localesSet ] = useState<LocaleStruct[] | false>(false);
	const [ menu, menuSet ] = useState(false);
	const [ newLang, newLangSet ] = useState<NewLangStruct | null>(null);
	const [ original, originalSet ] = useState<PostStruct | false>(false);
	const [ post, postSet ] = useState<PostStruct | false>(false);
	const [ remaining, remainingSet ] = useState<LocaleStruct[]>([]);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');
	const rightsPost = useRights('blog_post');
	const rightsPublish = useRights('blog_publish');

	// Refs
	const refHtml = useRef(null);
	const refTags = useRef(null);

	// Locale and categories effect
	useEffect(() => {

		// Fetch categories
		blog.read('admin/category').then(catsSet, err => {
			events.get('error').trigger(err);
		});

		// Subscribe to locales
		const oL = Locales.subscribe(l => {
			if(empty(l)) return;
			localesSet(l);
		});

		// Unsubscribe
		return () => {
			oL.unsubscribe();
		}

	}, []);

	// ID effect
	useEffect(() => {

		// Fetch the post from the server
		blog.read('admin/post', { _id }).then(data => {

			// If we have data and at least one locale
			if(data && !empty(data.locales)) {
				locSet(Object.keys(data.locales)[0])
				originalSet(clone(data));
				postSet(data);
			} else {
				events.get('error').trigger('Missing locales');
			}
		}, err => events.get('error').trigger(err));

	}, [ _id ]);

	// Calculate remaining locales
	useEffect(() => {

		// If either is false, do nothing
		if(locales === false || post === false) {
			return;
		}

		// Init remaining
		const lRemaining = [];

		// Go through all locales
		for(const o of locales) {

			// If we don't have it
			if(!(o._id in post.locales)) {
				lRemaining.push(o);
			}
		}

		// Set new remaining
		remainingSet(lRemaining);

	}, [ locales, post ]);

	// Called when a category is changed
	function catChange(id: string, checked: boolean) {

		// If we are adding the category
		if(checked) {
			postSet(o => {
				const i = (o as PostStruct).categories.indexOf(id);
				if(i === -1) {
					const oPost: PostStruct = clone(o);
					oPost.categories.push(id);
					return oPost;
				} else {
					return o;
				}
			});
		}

		// Else, if we are removing the category
		else {
			postSet(o => {
				const i = (o as PostStruct).categories.indexOf(_id);
				if(i > -1) {
					const oPost: PostStruct = clone(o);
					oPost.categories.splice(i, 1);
					return oPost;
				} else {
					return o;
				}
			});
		}
	}

	// Called when a specific value in a locale has been changed
	function dataChange(_locale: string, which: string, value: any) {
		postSet(o => {
			const oData = clone(o);
			oData.locales[_locale][which] = value;
			return oData;
		});
	}

	// Called to see if an error exists
	function errorExists(_locale: string, which: string) {
		return 'locales' in error &&
				_locale in error.locales &&
				which in error.locales[_locale];
	}

	// Called to get the error message
	function errorMsg(_locale: string, which: string) {

		// Check for a message in the specific locale
		let mMsg = ('locales' in error &&
				_locale in error.locales &&
				which in error.locales[_locale]) ?
					error.locales[_locale][which] :
					false;

		// If we have a message, translate it
		if(mMsg !== false) {
			if(isObject(mMsg)) {
				for(const k of Object.keys(mMsg)) {
					mMsg[k] = _.errors[mMsg[k]]
				}
			} else {
				mMsg = _.errors[mMsg];
			}
		}

		// Return the result
		return mMsg;
	}

	// Called to add a new locale to the post
	function localeAdd() {

		// Store the new locale
		const sLocale = (newLang as NewLangStruct).locale;

		// Update the post using the latest data
		postSet(o => {
			const oPost = clone(o);
			oPost.locales[sLocale] = {
				title: (newLang as NewLangStruct).title,
				slug: (newLang as NewLangStruct).slug,
				tags: (newLang as NewLangStruct).tags,
				content: (refHtml.current as unknown as HTML).value
			};
			return oPost;
		});

		// Remove the locale used from the remaining
		remainingSet(l => arrayFindDelete(l as LocaleStruct[], '_id', sLocale, true) as LocaleStruct[]);

		// Clear the new lang content
		newLangSet(null);

		// Set the new selected locale
		locSet(sLocale);
	}

	// Called when the location changes
	function locChanged(value: string, expanded: boolean) {

		// If we're not expanding, or already on that locale, do nothing
		if(!expanded || value === loc) {
			return;
		}

		// If we're clicking on new
		if(value === 'new') {

			// Do we have values?
			if(newLang === null) {

				// Init the new object using the first available locale
				const oLang: NewLangStruct = {
					content: '',
					locale: remaining[0]._id,
					title: '',
					slug: '',
					tags: [],
					meta: {}
				};

				// Set the new language data
				newLangSet(oLang);
			}
		}

		// If the old locale was new
		if(loc === 'new') {
			newLangSet(o => {
				const oLang = clone(o);
				oLang.content = (refHtml.current as unknown as HTML).value;
				return oLang;
			});
		}

		// Else, make sure we update the content in the post
		else {
			postSet(o => {
				const oData = clone(o);
				oData.locales[loc as string].content = (refHtml.current as unknown as HTML).value;
				return oData;
			});
		}

		// Set the new loc
		locSet(value);
	}

	// Called when a specific value in a new locale has been changed
	function newChange(which: string, value: any) {
		newLangSet(o => {
			const oData = clone(o);
			oData[which] = value;
			if(which === 'title') {
				oData.slug = titleToSlug(value);
			}
			return oData;
		});
	}

	// Called to publish the changes
	function publish() {

		// Send the request to the server
		blog.update('admin/post/publish', { _id }).then(data => {
			if(data) {
				events.get('success').trigger(_.publish.success);
				const i = timestamp();
				postSet(o => {
					const oPost = clone(o);
					oPost._updated = i;
					oPost.last_published = i;
					originalSet(oPost);
					return oPost;
				});
			}
		}, err => {
			events.get('error').trigger(err);
		})
	}

	// Called to submit changes
	function submit() {

		// Clear errors
		errorSet({});

		// Copy the post data
		const oData = clone(post);

		// If we're not on new
		if(loc !== 'new') {

			// Update the current content in the post
			oData.locales[loc as string].content = (refHtml.current as unknown as HTML).value;
		}

		// If nothing has changed from the original
		if(compare(oData, original)) {
			events.get('success').trigger(_.no_changes);
			return;
		}

		// Send the request to the server
		blog.update('admin/post', oData).then(data => {
			if(data) {
				oData._updated = timestamp();
				postSet(oData);
				originalSet(oData);
				events.get('success').trigger(_.saved);
			}
		}, err => {
			if(err.code === errors.body.DATA_FIELDS) {
				errorSet(pathToTree(err.msg));
				events.get('success').trigger(_.error_saving);
			} else {
				events.get('error').trigger(err);
			}
		});
	}

	// If we don't have the post, the categories, or the locales
	if(!post || !loc || !locales || !cats) {
		return (
			<Box id="blog_post_edit">
				<Typography>...</Typography>
			</Box>
		);
	}

	// Render
	return (
		<Box id="blog_post_edit">
			<Box className="blog_post_edit_content">
				<HTML
					error={'content' in error ? error.content : false}
					ref={refHtml}
					value={loc === 'new' ? (newLang as NewLangStruct).content : post.locales[loc].content}
				/>
			</Box>
			{fullScreen &&
				<Box className={'blog_post_edit_drawer_icon' + (menu ? ' drawer_open' : '')}>
					<IconButton onClick={() => menuSet(b => !b)}>
						<i className="fa-solid fa-bars" />
					</IconButton>
				</Box>
			}
			<Box className={'blog_post_edit_drawer' + (menu ? ' drawer_open' : '')}>
				{(rightsPublish.update && post._updated > post.last_published) &&
					<Box className="blog_post_edit_drawer_publish">
						<Button
							color="primary"
							onClick={publish}
							variant="contained"
						>{_.publish.button}</Button>
					</Box>
				}
				<Box className="blog_post_edit_drawer_fields">
					<Box className="field">
						<Box className="field_group">
							<Typography className="legend">{_.labels.categories}</Typography>
							{cats.map(o =>
								<Box className="category" key={o._id}>
									<FormControlLabel
										control={
											<Switch
												checked={post.categories.includes(o._id as string)}
												onChange={ev => catChange(o._id as string, ev.target.checked)}
											/>
										}
										label={localeTitle(o)}
									/>
								</Box>
							)}
						</Box>
					</Box>
					<Box className="blog_post_edit_locales">
						{omap(post.locales, (v, k) =>
							<Accordion
								className={k === loc ? 'accordion_expanded' : ''}
								expanded={k === loc}
								key={k}
								onChange={(ev, expanded) => locChanged(k, expanded)}
							>
								<AccordionSummary>
									{(afindo(locales, '_id', k) as LocaleStruct).name}
								</AccordionSummary>
								<AccordionDetails>
									<Box className="field">
										<TextField
											error={errorExists(k, 'title')}
											helperText={errorMsg(k, 'title')}
											InputLabelProps={{
												shrink: true,
											}}
											label={_.labels.title}
											onChange={ev => dataChange(k, 'title', ev.currentTarget.value)}
											placeholder={_.placeholders.title}
											size={fullScreen ? 'small' : 'medium'}
											value={post.locales[k].title}
										/>
									</Box>
									<Box className="field">
										<TextField
											error={errorExists(k, 'slug')}
											helperText={errorMsg(k, 'slug')}
											InputProps={{
												startAdornment:
													<InputAdornment position="start">
														{`${baseURL}/p/`}
													</InputAdornment>
											}}
											label={_.labels.slug}
											onChange={ev => dataChange(k, 'slug', ev.currentTarget.value)}
											size={fullScreen ? 'small' : 'medium'}
											value={post.locales[k].slug}
										/>
									</Box>
									<Box className="field">
										<Tags
											error={errorMsg(k, 'tags') }
											label={_.labels.tags}
											onChange={val => dataChange(k, 'tags', val)}
											placeholder={_.placeholders.tags}
											ref={refTags}
											value={post.locales[k].tags}
										/>
									</Box>
									<Meta
										allowed={allowedMeta}
										errors={errorMsg(k, 'meta') || {}}
										onChange={val => dataChange(k, 'meta', val)}
										value={post.locales[k].meta || {}}
									/>
								</AccordionDetails>
							</Accordion>
						)}
						{remaining.length > 0 &&
							<Accordion
								className={loc === 'new' ? 'accordion_expanded' : ''}
								expanded={loc === 'new'}
								onChange={(ev, expanded) => locChanged('new', expanded)}
							>
								<AccordionSummary>
									{_.new_locale}
								</AccordionSummary>
								<AccordionDetails>
									{newLang !== null &&
										<React.Fragment>
											<Box className="field">
												<FormControl error={'_locale' in error}>
													<InputLabel id="blog_edit_post_locale_select">
														{_.labels.language}
													</InputLabel>
													<Select
														label={_.labels.language}
														labelId="blog_edit_post_locale_select"
														native
														onChange={ev => newChange('locale', ev.target.value)}
														size={fullScreen ? 'small' : 'medium'}
														value={(newLang as NewLangStruct).locale}
														variant="outlined"
													>
														{remaining.map(o =>
															<option key={o._id} value={o._id}>{o.name}</option>
														)}
													</Select>
													{'_locale' in error &&
														<FormHelperText>{error._locale}</FormHelperText>
													}
												</FormControl>
											</Box>
											<Box className="field">
												<TextField
													error={'title' in error}
													helperText={error.title || ''}
													InputLabelProps={{
														shrink: true,
													}}
													label={_.labels.title}
													onChange={ev => newChange('title', ev.currentTarget.value)}
													placeholder={_.placeholders.title}
													size={fullScreen ? 'small' : 'medium'}
													value={(newLang as NewLangStruct).title}
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
													onChange={ev => newChange('slug', ev.currentTarget.value)}
													size={fullScreen ? 'small' : 'medium'}
													value={(newLang as NewLangStruct).slug}
												/>
											</Box>
											<Box className="field">
												<Tags
													error={'tags' in error ? error.tags : false}
													label={_.labels.tags}
													onChange={val => newChange('tags', val)}
													placeholder={_.placeholders.tags}
													value={(newLang as NewLangStruct).tags}
												/>
											</Box>
											<Box className="actions">
												<Button
													color="primary"
													onClick={localeAdd}
													variant="contained"
												>{_.new_locale}</Button>
											</Box>
										</React.Fragment>
									}
								</AccordionDetails>
							</Accordion>
						}
					</Box>
				</Box>
				{rightsPost.update &&
					<Box className="blog_post_edit_drawer_actions">
						<Button
							color="primary"
							onClick={submit}
							variant="contained"
						>{_.submit}</Button>
					</Box>
				}
			</Box>
		</Box>
	);
}

// Valid props
Edit.propTypes = {
	_id: PropTypes.string.isRequired,
	allowedMeta: PropTypes.arrayOf(PropTypes.string).isRequired,
	baseURL: PropTypes.string.isRequired
}