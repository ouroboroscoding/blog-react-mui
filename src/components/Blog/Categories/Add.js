/**
 * Category Add
 *
 * Popup dialog for creating a new category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-11
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { timestamp } from '@ouroboros/dates';
import { DefineParent } from '@ouroboros/define-mui';
import events from '@ouroboros/events';
import { afindi, omap, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { createRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project modules
import { define_titleToSlug } from '../../../functions/titleToSlug';

// Translations
import TEXT from '../../../translations/categories';

/**
 * Category Add
 *
 * Handles the form for a single locale associated with a category
 *
 * @name Add
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Add({
	locale, locales, onAdded, onCancel, open, tree
}) {

	// State
	const [ data, dataSet ] = useState(null);

	// Hooks
	const mobile = useMediaQuery('(max-width:400px)');

	// Load effect
	useEffect(() => {

		// Init the first data key
		let sLocale = null;

		// If the current locale matches one in the list
		const i = afindi(locales, '_id', locale)
		if(i !== -1) {
			sLocale = locales[i]._id;
		}

		// Else, just grab the first one
		else {
			sLocale = locales[0]._id;
		}

		// Clear the data completely by creating new locale data for the
		//	key found
		dataSet({
			[sLocale]: {
				key: uuidv4(),
				ref: createRef()
			}
		});

	}, [ locale, locales ]);

	// Called to add a new locale to the data
	function dataAdd() {

		// Get the latest data
		dataSet(o => {

			// If the count of data keys matches the locales, you shall not pass
			if(Object.keys(o).length === locales.length) {
				return o;
			}

			// Get the new locale by filtering out the ones already used and
			//	then using the first one we find in the remaining
			const sLocale = locales.filter(o => !(o['_id'] in data))[0]._id;

			// Shallow copy the data and add the new empty locale to the copy
			const oData = { ...o };
			oData[sLocale] = {
				key: uuidv4(),
				ref: createRef()
			}

			// Return the new data
			return oData;
		});
	}

	// Called to remove a locale from the data
	function dataRemove(loc) {

		// Get the latest data
		dataSet(o => {

			// If it doesn't exist, do nothing
			if(!(loc in data)) {
				return;
			}

			// Shallow copy the data and remove the locale from the copy
			const oData = { ...o };
			delete oData[loc];

			// Return the new data
			return oData;
		});
	}

	// Called when any of the locale selectors changes
	function localeChanged(was, is) {

		// Get the latest data
		dataSet(o => {

			// If we don't have the "was"
			if(!(was in data)) {
				return;
			}

			// Shallow copy the data
			const oData = { ...o };

			// Add the new locale
			oData[is] = oData[was]

			// Delete the old locale
			delete oData[was];

			// Return the new data
			return oData;
		});
	}

	// Called to upload the file
	function submit() {

		// Init the data with the name
		const oData = { locales: {} };

		// Keep track of used slugs
		const lSlugs = [];

		// Go through each locale
		for(const k in data) {

			// If the form data is invalid, stop immediately
			if(!data[k].ref.current.valid()) {
				return;
			}

			// Add the locale data
			oData.locales[k] = data[k].ref.current.value;

			// If the slug already exists
			if(lSlugs.includes(oData.locales[k].slug)) {

				// Add the duplicate error and stop
				data[k].ref.current.error({ slug: 'duplicate' });
				return;
			}

			// Add the slug
			lSlugs.push(oData.locales[k].slug);
		}

		// Make the request to the server
		blog.create('admin/category', {
			record: oData
		}).then(data => {

			// Add the ID and created timestamp
			oData._id = data;
			oData._created = timestamp();

			// Pass along the data to the parent
			onAdded(oData);

		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				const oErrors = pathToTree(error.msg).records;
				for(const loc in oErrors.locale) {
					data[loc].ref.current.error(oErrors.locale[loc]);
				}
			} else if(error.code === errors.body.DB_DUPLICATE) {
				data[error.msg[0][0]].ref.current.error({ slug: 'duplicate' });
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Dialog
			fullScreen={mobile}
			id="blog_category_add"
			onClose={onCancel}
			open={open}
		>
			<DialogTitle>{_.add.title}</DialogTitle>
			<DialogContent>
				{(locales === false || data === null) ?
					<Typography>...</Typography>
				:
					<React.Fragment>
						{locales.length === 1 ?
							<DefineParent
								name={locales[0]}
								node={tree}
								onNodeChange={{
									title: define_titleToSlug
								}}
								ref={data[locales[0]].ref}
								type="create"
							/>
						:
							<React.Fragment>
								{omap(data, (v,k,i) =>
									<Paper key={v.key} className="blog_category_add_locale">
										<Box className="blog_category_add_locale_header">
											<Box className="blog_category_add_locale_select">
												<FormControl>
													<InputLabel id={`category_locale_select_${v.key}`}>
														{_.label.language}
													</InputLabel>
													<Select
														label={_.label.language}
														labelId={`category_locale_select_${v.key}`}
														native
														onChange={ev => localeChanged(k, ev.target.value)}
														size="small"
														value={k}
													>
														{locales.filter(o => {
															return o['_id'] === k || !(o['_id'] in data);
														}).map(o =>
															<option key={o['_id']} value={o['_id']}>{o['name']}</option>
														)}
													</Select>
												</FormControl>
											</Box>
											{i > 0 &&
												<Box>
													<Button
														color="secondary"
														onClick={() => dataRemove(k)}
														variant="contained"
													>
														<i className="fa-solid fa-times" />
													</Button>
												</Box>
											}
										</Box>
										<br />
										<DefineParent
											name={k}
											node={tree}
											onNodeChange={{
												title: define_titleToSlug
											}}
											ref={data[k].ref}
											type="create"
										/>
									</Paper>
								)}
							</React.Fragment>
						}
						{Object.keys(data).length !== locales.length &&
							<Box className="blog_category_add_locale_add">
								<Button color="primary" onClick={dataAdd} variant="contained">
									<i className="fa-solid fa-plus" />
								</Button>
							</Box>
						}
					</React.Fragment>
				}
			</DialogContent>
			<DialogActions>
				<Button
					color="secondary"
					onClick={onCancel}
					variant="contained"
				>{_.cancel}</Button>
				{data !== null &&
					<Button
						color="primary"
						onClick={submit}
						variant="contained"
					>{_.add.submit}</Button>
				}
			</DialogActions>
		</Dialog>
	);
}

// Valid props
Add.propTypes = {
	locale: PropTypes.string.isRequired,
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onAdded: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	tree: PropTypes.object.isRequired
}