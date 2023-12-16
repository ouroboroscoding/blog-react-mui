/**
 * Categories
 *
 * Primary entry into categories component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-11
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import CategoryLocaleDef from '@ouroboros/blog/definitions/category_locale';
import clone from '@ouroboros/clone';
import { Tree } from '@ouroboros/define';
import { useRights } from '@ouroboros/brain-react';
import { locales as Locales } from '@ouroboros/mouth-mui';
import { afindi, arrayFindDelete, combine, empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Local components
import Add from './Add';
import Category from './Category';

// Local modules
import title from './title';

// Translations
import TEXT from './text';

// Create the category locale Tree
const CategoryLocaleTree = new Tree(CategoryLocaleDef, {
	__ui__: {
		__create__: [ 'title', 'slug', 'description'],
		__update__: [ 'title', 'slug', 'description']
	}
});

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
export default function Categories({ baseURL, locale, onError }) {

	// State
	const [ add, addSet ] = useState(false);
	const [ locales, localesSet ] = useState(false);
	const [ records, recordsSet ] = useState([]);
	const [ remove, removeSet ] = useState(null);

	// Get rights
	const rights = useRights('blog_category');

	// Load effect
	useEffect(() => {

		// Fetch from the server
		blog.read('admin/category').then(recordsSet, error => {
			onError(error);
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

	// Called after new category is added
	function categoryAdded(category) {

		// Add it to the records and re-sort by name
		recordsSet(l => {
			const lRecords = clone(l);
			lRecords.unshift(category);
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

	// Called when any category is updated
	function categoryUpdated(_id, data) {

		// Get latest
		recordsSet(l => {

			// Get the index
			const i = afindi(l, '_id', _id);
			if(i < 0) {
				return l;
			}

			// Clone the records and combine the data for the category
			const lRecords = clone(l);
			lRecords[i] = combine(lRecords[i], data);

			// Return the new records
			return lRecords;
		})
	}

	// Text
	const _ = TEXT[locale];

	// If we don't have locales yet
	if(locales === false) {
		return (
			<Box id="blog_categories">
				<Typography>...</Typography>
			</Box>
		)
	}

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
						<Category
							baseURL={baseURL}
							key={o._id}
							locale={locale}
							locales={locales}
							onDelete={() => removeSet(o)}
							onUpdated={cat => categoryUpdated(o._id, cat)}
							onError={onError}
							rights={rights}
							tree={CategoryLocaleTree}
							value={o}
						/>
					)
				}
			</Box>
			{rights.create &&
				<Add
					locale={locale}
					locales={locales}
					onAdded={categoryAdded}
					onCancel={() => addSet(false)}
					onError={onError}
					open={add}
					tree={CategoryLocaleTree}
				/>
			}
			{remove !== null &&
				<Dialog
					id="blog_category_delete"
					onClose={() => removeSet(null)}
					open={true}
				>
					<DialogTitle>{_.remove.title.replace('{TITLE}', title(locale, remove))}</DialogTitle>
					<DialogContent>
						<DialogContentText>{_.remove.confirm.replace('{TITLE}', title(locale, remove))}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							color="secondary"
							onClick={categoryRemove}
							variant="contained"
						>{_.remove.button}</Button>
					</DialogActions>
				</Dialog>
			}
		</Box>
	);
}

// Valid props
Categories.propTypes = {
	baseURL: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
}