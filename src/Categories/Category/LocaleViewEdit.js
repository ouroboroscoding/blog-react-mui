/**
 * Category Locale View/Edit
 *
 * Handles displaying a single locale within a category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-15
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { DefineParent } from '@ouroboros/define-mui';
import { afindo, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Project components
import ConfirmDelete from 'blog/ConfirmDelete';

// Translations
import TEXT from '../text';

/**
 * Category Locale View/Edit
 *
 * Handles viewing and editing of a single category locale
 *
 * @name LocaleViewEdit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function LocaleViewEdit({
	baseURL, count, locale, locales, onDeleted, onError, onUpdated, rights,
	tree, value
}) {

	// State
	const [ edit, editSet ] = useState(false);

	// Refs
	const refForm = useRef(null);

	// Called to delete the locale record
	function remove() {

		// Send the request to the server
		blog.delete('admin/category/locale', {
			_id: value._category,
			locale: value._locale
		}).then(data => {
			if(data) {
				onDeleted(value._locale);
			}
		}, onError)
	}

	// Called to update the locale record
	function update() {

		// Get the record from the parent
		const dRecord = refForm.current.value;

		// Send the request to the server
		blog.update('admin/category/locale', {
			_id: value._category,
			locale: value._locale,
			record: dRecord
		}).then(data => {
			if(data) {
				editSet(false);
				onUpdated(dRecord)
			}
		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				refForm.current.error(pathToTree(error.msg).record);
			} else if(error.code === errors.body.DB_DUPLICATE) {
				refForm.current.error({ slug: TEXT[locale].duplicate });
			} else if(error.code === errors.body.DB_UPDATE_FAILED) {
				return;
			} else {
				onError(error);
			}
		});
	}

	// Text
	const _ = TEXT[locale];

	// Render
	return edit ? (
		<React.Fragment>
			<Typography><b>{afindo(locales, '_id', value._locale).name}</b></Typography>
			<DefineParent
				name={value._locale}
				node={tree}
				ref={refForm}
				type="update"
				value={value}
			/>
			<Box className="actions">
				<Button
					color="secondary"
					onClick={() => editSet(false)}
					variant="contained"
				>{_.cancel}</Button>
				<Button
					color="primary"
					onClick={update}
					variant="contained"
				>{_.locale.update}</Button>
			</Box>
		</React.Fragment>
	) : (
		<Paper className="blog_categories_record_view">
			<Box className="view_left">
				{locales.length > 1 &&
					<Typography><nobr><b>{_.label.language}</b></nobr></Typography>
				}
				<Typography><nobr>{_.label.slug}</nobr></Typography>
				<Typography><nobr>{_.label.title}</nobr></Typography>
				<Typography><nobr>{_.label.description}</nobr></Typography>
			</Box>
			<Box className="view_center">
				{locales.length > 1 &&
					<Typography><b>{afindo(locales, '_id', value._locale).name}</b></Typography>
				}
				<Typography>{baseURL}/c/{value.slug}<br /></Typography>
				<Typography>{value.title}<br /></Typography>
				<Typography>{value.description}</Typography>
			</Box>
			{rights.update &&
				<Box className="view_right">
					<i
						className={'fa-solid fa-edit' + (edit ? ' open' : '')}
						onClick={() => editSet(b => !b)}
					/><br />
					{count > 1 &&
						<ConfirmDelete
							onConfirm={remove}
						/>
					}
				</Box>
			}
		</Paper>
	);
}

// Valid props
LocaleViewEdit.propTypes = {
	baseURL: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	locale: PropTypes.string.isRequired,
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDeleted: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	onUpdated: PropTypes.func.isRequired,
	rights: PropTypes.object.isRequired,
	tree: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired
}