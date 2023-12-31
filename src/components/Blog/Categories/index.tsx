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
import CategoryLocaleDef from '@ouroboros/blog/definitions/category_locale.json';
import { useRights } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import { Tree } from '@ouroboros/define';
import events from '@ouroboros/events';
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

// Project modules
import localeTitle from '../../../functions/localeTitle';
import Translation from '../../../translations';

// Create the category locale Tree
const CategoryLocaleTree = new Tree(CategoryLocaleDef, {
	__ui__: {
		__create__: [ 'title', 'slug', 'description'],
		__update__: [ 'title', 'slug', 'description']
	}
});

// Types
import type { LocaleStruct } from '../../../types';
export type CategoriesProps = {
	baseURL: string
}
export type CategoryStruct = {
	_id?: string,
	_created?: number,
	locales: Record<string, CategoryLocaleStruct>
}
export type CategoryLocaleStruct = {
	_id?: string,
	_created?: number,
	_locale?: string,
	_category?: string,
	slug: string,
	title: string,
	description: string
}

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
export default function Categories({ baseURL }: CategoriesProps) {

	// Text
	const _ = Translation.get().categories;

	// State
	const [ add, addSet ] = useState<boolean>(false);
	const [ locales, localesSet ] = useState<LocaleStruct[] | false>(false);
	const [ records, recordsSet ] = useState<CategoryStruct[] | false>(false);
	const [ remove, removeSet ] = useState<CategoryStruct | null>(null);

	// Get rights
	const rights = useRights('blog_category');

	// Load effect
	useEffect(() => {

		// Fetch from the server
		blog.read('admin/category').then(recordsSet, error => {
			events.get('error').trigger(error);
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
	function categoryAdded(category: CategoryStruct) {

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
			_id: (remove as CategoryStruct)._id
		}).then(data => {
			if(data) {
				recordsSet(l => arrayFindDelete(l as CategoryStruct[], '_id', (remove as CategoryStruct)._id, true) as CategoryStruct[]);
				removeSet(null);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Called when any category is updated
	function categoryUpdated(_id: string, data: CategoryStruct) {

		// Get latest
		recordsSet(l => {

			// Get the index
			const i = afindi(l as CategoryStruct[], '_id', _id);
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
				) || ((records as CategoryStruct[]).length === 0 &&
					<Box>
						<Typography>{_.no_records}</Typography>
					</Box>
				) ||
					(records as CategoryStruct[]).map(o =>
						<Category
							baseURL={baseURL}
							key={o._id}
							locales={locales}
							onDelete={() => removeSet(o)}
							onUpdated={cat => categoryUpdated(o._id as string, cat)}
							rights={rights}
							tree={CategoryLocaleTree}
							value={o}
						/>
					)
				}
			</Box>
			{rights.create &&
				<Add
					locales={locales}
					onAdded={categoryAdded}
					onCancel={() => addSet(false)}
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
					<DialogTitle>{_.remove.title.replace('{TITLE}', localeTitle(remove))}</DialogTitle>
					<DialogContent>
						<DialogContentText>{_.remove.confirm.replace('{TITLE}', localeTitle(remove))}</DialogContentText>
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
	baseURL: PropTypes.string.isRequired
}