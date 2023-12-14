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
import { empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
	locale, locales, onDelete, onError, rights, value
}) {

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Accordion className="blog_categories_record">
			<AccordionSummary>{title(locale, value)}</AccordionSummary>
			<AccordionDetails>
				<Box className="blog_categories_record_actions">
					{rights.update &&
						<i className="fa-solid fa-edit" />
					}
					{rights.delete &&
						<i className="fa-solid fa-trash-alt" onClick={onDelete} />
					}
				</Box>
				<pre>{JSON.stringify(value.locales, null, 4)}</pre>
			</AccordionDetails>
		</Accordion>
	);
}

// Valid props
Category.propTypes = {
	locale: PropTypes.string.isRequired,
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	rights: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired
}