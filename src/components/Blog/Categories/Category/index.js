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
import { combine, omap } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Locale components
import LocaleAdd from './LocaleAdd';
import LocaleViewEdit from './LocaleViewEdit';

// Locale modules
import localeTitle from '../../../../functions/localeTitle';

/**
 * Category
 *
 * Handles displaying and editing a single category
 *
 * @name Category
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Category({
	baseURL, locales, onDelete, onUpdated, rights, tree, value
}) {

	// State
	const [ add, addSet ] = useState(false);

	// Called when a locale has been added to the category
	function localeAdded(loc, data) {

		// Clear add state
		addSet(false);

		// Clone the value
		const o = { ...value }

		// Add the locale
		o.locales[loc] = data;

		// Notify the parent
		onUpdated(o);
	}

	// Called when a locale has been removed from the category
	function localeDeleted(loc) {

		// Clone the value
		const o = { ...value }

		// Remove the locale
		delete o.locales[loc]

		// Notify the parent
		onUpdated(o);
	}

	function localeUpdated(loc, data) {

		// Clone the value
		const o = { ...value }

		// Combined the locale
		o.locales[loc] = combine(o.locales[loc], data);

		// Notify the parent
		onUpdated(o);
	}

	// Render
	return (
		<Accordion className="blog_categories_record">
			<AccordionSummary>{localeTitle(value)}</AccordionSummary>
			<AccordionDetails>
				<Box className="blog_categories_record_actions">
					{rights.delete &&
						<i
							className="fa-solid fa-trash-alt"
							onClick={onDelete}
						/>
					}
				</Box>
				{omap(value.locales, (v,k,i) =>
					<LocaleViewEdit
						baseURL={baseURL}
						count={Object.keys(value.locales).length}
						key={k}
						locales={locales}
						onDeleted={() => localeDeleted(k)}
						onUpdated={data => localeUpdated(k, data)}
						rights={rights}
						tree={tree}
						value={{
							_category: value._id,
							_locale: k,
							...v
						}}
					/>
				)}
				{(rights.update && !add && Object.keys(value.locales).length !== locales.length) &&
					<Box className="blog_category_record_locale_add">
						<Button color="primary" onClick={() => addSet(true)} variant="contained">
							<i className="fa-solid fa-plus" />
						</Button>
					</Box>
				}
				{add &&
					<LocaleAdd
						category={value._id}
						locales={locales.filter(o => {
							return !(o._id in value.locales);
						})}
						onAdded={localeAdded}
						onCancel={() => addSet(false)}
						tree={tree}
					/>
				}
			</AccordionDetails>
		</Accordion>
	);
}

// Valid props
Category.propTypes = {
	baseURL: PropTypes.string.isRequired,
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func.isRequired,
	onUpdated: PropTypes.func.isRequired,
	rights: PropTypes.object.isRequired,
	tree: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired
}