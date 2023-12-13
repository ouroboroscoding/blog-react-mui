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
import CategoryLocaleDef from '@ouroboros/blog/definitions/category_locale';
import { Tree } from '@ouroboros/define';
import { DefineParent } from '@ouroboros/define-mui';
import { locales as Locales } from '@ouroboros/mouth-mui';
import {
	afindi, empty, omap, pathToTree
} from '@ouroboros/tools';

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

// Translations
import TEXT from './text';

// Create the category locale Tree
console.log(CategoryLocaleDef);
const CategoryLocaleTree = new Tree(CategoryLocaleDef, {
	__ui__: {
		__create__: [ 'title', 'slug', 'description']
	}
})

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
export default function Add({ locale, onAdded, onCancel, onError, open }) {

	// State
	const [ errs, errsSet ] = useState({});
	const [ name, nameSet ] = useState('');
	const [ data, dataSet ] = useState(null);
	const [ locs, locsSet ] = useState(false);

	// Hooks
	const mobile = useMediaQuery('(max-width:400px)');

	// Load effect
	useEffect(() => {

		// Subscribe to locales available
		const oL = Locales.subscribe(l => {

			console.log(l);

			// If it's nothing, do nothing
			if(empty(l)) {
				return;
			}

			// Set the locales available
			locsSet(l);

			// Init the first data key
			let sLocale = null;

			// If the current locale matches one in the list
			const i = afindi(l, '_id', locale)
			if(i !== -1) {
				sLocale = l[i]._id;
			}

			// Else, just grab the first one
			else {
				sLocale = l[0]._id;
			}

			// Clear the data completely by creating new locale data for the
			//	key found
			dataSet({
				[sLocale]: {
					key: uuidv4(),
					ref: createRef()
				}
			});
		});

		// Unsubscribe
		return () => {
			oL.unsubscribe();
		}
	}, []);

	// Called to add a new locale to the data
	function dataAdd() {

		// Get the latest data
		dataSet(o => {

			// If the count of data keys matches the locales, you shall not pass
			if(Object.keys(o).length === locs.length) {
				return o;
			}

			// Get the new locale by filtering out the ones already used and
			//	then using the first one we find in the remaining
			const sLocale = locs.filter(o => !(o['_id'] in data))[0]._id;

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

	// Called when any of the data in the individual forms changes
	function dataChanged(loc, value) {

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

		const oData = {};

		// Make the request to the server
		blog.create('admin/category', oData).then(data => {

			// Pass along the data tp the parent
			onAdded(oData);

		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				errsSet(pathToTree(error.msg));
			} else if(error.code === errors.body.DB_DUPLICATE) {
				errsSet({ duplicate: true });
			} else {
				onError(error);
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
				{(locs === false &&
					<Typography>...</Typography>
				) || (locs.length === 1 &&
					<DefineParent
						name={locs[0]}
						node={CategoryLocaleTree}
						ref={data[locs[0]].ref}
						type="create"
					/>
				) || (data !== null &&
					<React.Fragment>
						{omap(data, (v,k,i) =>
							<Paper key={v.key} className="blog_category_add_locale">
								<Box className="blog_category_add_locale_header">
									<Box className="blog_category_add_locale_select">
										<FormControl>
											<InputLabel id={`category_locale_select_${v.key}`}>
												{_.add.language}
											</InputLabel>
											<Select
												label={_.add.language}
												labelId={`category_locale_select_${v.key}`}
												native
												onChange={ev => localeChanged(k, ev.target.value)}
												size="small"
												value={k}
											>
												{locs.filter(o => {
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
									node={CategoryLocaleTree}
									ref={data[k].ref}
									type="create"
								/>
							</Paper>
						)}
						{Object.keys(data).length != locs.length &&
							<Box className="blog_category_add_locale_add">
								<Button color="primary" onClick={dataAdd} variant="contained">
									<i className="fa-solid fa-plus" />
								</Button>
							</Box>
						}
					</React.Fragment>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					color="secondary"
					onClick={onCancel}
					variant="contained"
				>{_.add.cancel}</Button>
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
	onAdded: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired
}