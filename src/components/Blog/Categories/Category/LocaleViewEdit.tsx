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
import events from '@ouroboros/events';
import { afindo, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Project modules
import Translation from '../../../../translations';

// Project components
import ConfirmDelete from '../../../elements/ConfirmDelete';

// Types
import type { rightsStruct } from '@ouroboros/brain-react';
import type { Tree } from '@ouroboros/define';
import type { CategoryLocaleStruct } from '..';
import type { LocaleStruct } from '../../../../types';
export type LocaleViewEditProps = {
	baseURL: string,
	count: number,
	locales: LocaleStruct[],
	onDeleted: (val: string) => void,
	onUpdated: (val: CategoryLocaleStruct) => void,
	rights: rightsStruct,
	tree: Tree,
	value: CategoryLocaleStruct
}

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
	baseURL, count, locales, onDeleted, onUpdated, rights, tree, value
}: LocaleViewEditProps) {

	// Text
	const _ = Translation.get().categories;

	// State
	const [ edit, editSet ] = useState(false);

	// Refs
	const refForm = useRef<DefineParent>(null);

	// Called to delete the locale record
	function remove() {

		// Send the request to the server
		blog.delete('admin/category/locale', {
			_id: value._category,
			locale: value._locale
		}).then(data => {
			if(data) {
				onDeleted(value._locale as string);
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Called to update the locale record
	function update() {

		// Get the record from the parent
		const dRecord = (refForm.current as DefineParent).value;

		// Send the request to the server
		blog.update('admin/category/locale', {
			_id: value._category,
			locale: value._locale,
			record: dRecord
		}).then(data => {
			if(data) {
				editSet(false);
				onUpdated(dRecord as CategoryLocaleStruct)
			}
		}, error => {
			if(error.code === errors.body.DATA_FIELDS) {
				(refForm.current as DefineParent).error(pathToTree(error.msg).record);
			} else if(error.code === errors.body.DB_DUPLICATE) {
				(refForm.current as DefineParent).error({
					slug: _.duplicate
				});
			} else if(error.code === errors.body.DB_UPDATE_FAILED) {
				return;
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Render
	return edit ? (
		<React.Fragment>
			<Typography><b>{(afindo(locales as LocaleStruct[], '_id', value._locale) as LocaleStruct).name}</b></Typography>
			<DefineParent
				name={value._locale as string}
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
					<Typography><span className="nobr"><b>{_.label.language}</b></span></Typography>
				}
				<Typography><span className="nobr">{_.label.slug}</span></Typography>
				<Typography><span className="nobr">{_.label.title}</span></Typography>
				<Typography><span className="nobr">{_.label.description}</span></Typography>
			</Box>
			<Box className="view_center">
				{locales.length > 1 &&
					<Typography><b>{(afindo(locales as LocaleStruct[], '_id', value._locale) as LocaleStruct).name}</b></Typography>
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
	locales: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDeleted: PropTypes.func.isRequired,
	onUpdated: PropTypes.func.isRequired,
	rights: PropTypes.object.isRequired,
	tree: PropTypes.object.isRequired,
	value: PropTypes.object.isRequired
}