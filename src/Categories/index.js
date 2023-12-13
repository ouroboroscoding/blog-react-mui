/**
 * Media
 *
 * Primary entry into media component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import clone from '@ouroboros/clone';
import { useRights } from '@ouroboros/brain-react';
import events from '@ouroboros/events';
import { afindi, arrayFindDelete, sortByKey } from '@ouroboros/tools';

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

// Local components
import Add from './Add';

// Translations
import TEXT from './text';

/**
 * Categories
 *
 * Handles fetching and display of media
 *
 * @name Categories
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Categories({ locale, onError }) {

	// State
	const [ add, addSet ] = useState(false);
	const [ records, recordsSet ] = useState([]);
	const [ remove, removeSet ] = useState(null);

	// Get rights
	const rights = useRights('blog_category');

	// Called to fetch records
	function fetch(filter) {

		// Fetch from the server
		recordsSet(false);
		blog.read('admin/category').then(recordsSet, error => {
			onError(error);
		});
	}

	// Called after new category is added
	function categoryAdded(file) {

		// Add it to the records and re-sort by name
		recordsSet(l => {
			const lRecords = clone(l);
			lRecords.push(file);
			lRecords.sort(sortByKey('name'));
			return lRecords;
		});

		// Hide the form
		addSet(false);
	}

	// Called to delete the currently set `remove` category
	function categoryRemove() {

		// Send the delete request to the server
		blog.delete('admin/category', {
			_id: remove._id
		}).then(data => {
			if(data) {
				recordsSet(l => arrayFindDelete(l, '_id', remove._id, true));
				removeSet(null);
			}
		}, error => {
			onError(error);
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog_categories">
			{rights.create &&
				<Button
					className="blog_category_add_button"
					color="primary"
					onClick={() => addSet(true)}
					variant="contained"
				>{_.add.title}</Button>
			}
			<Box className="blog_categories_records">
				<br />
				{(records === false &&
					<Box>
						<Typography>...</Typography>
					</Box>
				) || (records.length === 0 &&
					<Box>
						<Typography>{_.no_records}</Typography>
					</Box>
				) ||
					records.map(o =>
						<Accordion>
							<AccordionSummary>{o.name}</AccordionSummary>
							<AccordionDetails>
								<pre>{JSON.stringify(o.locales, null, 4)}</pre>
							</AccordionDetails>
						</Accordion>
					)
				}
			</Box>
			{rights.create &&
				<Add
					locale={locale}
					onAdded={categoryAdded}
					onCancel={() => addSet(false)}
					onError={onError}
					open={add}
				/>
			}
		</Box>
	);
}

// Valid props
Categories.propTypes = {
	locale: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
}