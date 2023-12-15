/**
 * Category
 *
 * Handles displaying a single category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import { DefineParent } from '@ouroboros/define-mui';
import { afindo, omap } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { createRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

// Locale modules
import title from './title';

// Translations
import TEXT from './text';

/**
 * Category
 *
 * Handles fetching and display of media
 *
 * @name Category
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Category({
	baseURL, locale, locales, onDelete, onError, rights, tree, value
}) {

	// State
	const [ edit, editSet ] = useState(false);

	// Called to add a new locale to the edit data
	function editAdd() {

		// Get the latest data
		editSet(o => {

			// If the count of data keys matches the locales, you shall not pass
			if(Object.keys(o).length === locales.length) {
				return o;
			}

			// Get the new locale by filtering out the ones already used and
			//	then using the first one we find in the remaining
			const sLocale = locales.filter(o => !(o['_id'] in edit))[0]._id;

			// Shallow copy the data and add the new empty locale to the copy
			const oEdit = { ...o };
			oEdit[sLocale] = {
				key: uuidv4(),
				ref: createRef()
			}

			// Return the new data
			return oEdit;
		});
	}

	// Called to fill in the initial edit keys and refs
	function editFill() {

		// Make a new object to hold the records and keys
		const oEdit = {};

		// Go through each of the original locales
		for(let k of Object.keys(value.locales)) {
			oEdit[k] = {
				key: uuidv4(),
				ref: createRef()
			}
		}

		// Return the new edit data
		return oEdit;
	}

	// Called to remove a locale from the edit data
	function editRemove(loc) {

		// Get the latest data
		editSet(o => {

			// If it doesn't exist, do nothing
			if(!(loc in edit)) {
				return;
			}

			// Shallow copy the data and remove the locale from the copy
			const oEdit = { ...o };
			delete oEdit[loc];

			// Return the new data
			return oEdit;
		});
	}

	// Called when any of the locale selectors changes
	function localeChanged(was, is) {

		// Get the latest data
		editSet(o => {

			// If we don't have the "was"
			if(!(was in edit)) {
				return;
			}

			// Shallow copy the data
			const oEdit = { ...o };

			// Add the new locale
			oEdit[is] = oEdit[was]

			// Delete the old locale
			delete oEdit[was];

			// Return the new data
			return oEdit;
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Accordion className="blog_categories_record">
			<AccordionSummary>{title(locale, value)}</AccordionSummary>
			<AccordionDetails>
				<Box className="blog_categories_record_actions">
					{rights.update &&
						<i
							className={'fa-solid fa-edit' + (edit ? ' open' : '')}
							onClick={() => editSet(b => { return b ? false : editFill() })}
						/>
					}
					{rights.delete &&
						<i
							className="fa-solid fa-trash-alt"
							onClick={onDelete}
						/>
					}
				</Box>
				{edit !== false ? (
					locales.length === 1 ?
						<DefineParent
							name={locales[0]}
							node={tree}
							ref={edit[locales[0]].ref}
							type="update"
							value={value.locales[locales[0]]}
						/>
					:
						<React.Fragment>
							{omap(edit, (v,k,i) =>
								<Paper key={v.key} className="blog_category_record_locale">
									<Box className="blog_category_record_locale_header">
										<Box className="blog_category_record_locale_select">
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
														return o['_id'] === k || !(o['_id'] in edit);
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
													onClick={() => editRemove(k)}
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
										ref={edit[k].ref}
										type="update"
										value={value.locales[k]}
									/>
								</Paper>
							)}
							{Object.keys(edit).length != locales.length &&
								<Box className="blog_category_record_locale_add">
									<Button color="primary" onClick={editAdd} variant="contained">
										<i className="fa-solid fa-plus" />
									</Button>
								</Box>
							}
						</React.Fragment>
				) : (
					omap(value.locales, (v, k) =>
						<Paper key={k} className="blog_categories_record_view">
							<Box className="view_left">
								<Typography><nobr><b>{_.label.language}</b></nobr></Typography>
								<Typography><nobr>{_.label.slug}</nobr></Typography>
								<Typography><nobr>{_.label.title}</nobr></Typography>
								<Typography><nobr>{_.label.description}</nobr></Typography>
							</Box>
							<Box className="view_right">
								<Typography><b>{afindo(locales, '_id', k).name}</b></Typography>
								<Typography>{baseURL}/c/{v.slug}<br /></Typography>
								<Typography>{v.title}<br /></Typography>
								<Typography>{v.description}</Typography>
							</Box>
						</Paper>
					)
				)}
			</AccordionDetails>
		</Accordion>
	);
}

// Valid props
Category.propTypes = {
	baseURL: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	rights: PropTypes.object.isRequired,
	tree: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired
}