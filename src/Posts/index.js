/**
 * Posts
 *
 * Primary entry into posts component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-11
 */

// Ouroboros modules
import blog from '@ouroboros/blog';
import clone from '@ouroboros/clone';
import { useRights } from '@ouroboros/brain-react';
import { copy } from '@ouroboros/browser/clipboard';
import { timestamp } from '@ouroboros/dates';
import events from '@ouroboros/events';
import { afindi, arrayFindDelete, empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// Local components
import Add from './Add';
import Filter from './Filter';
import View from './View';

// Translations
import TEXT from './text';

/**
 * Posts
 *
 * Handles fetching and view of posts
 *
 * @name Posts
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Posts({ locale, onError }) {

	// State
	const [ add, addSet ] = useState(false);
	const [ records, recordsSet ] = useState([]);
	const [ remove, removeSet ] = useState(null);
	const [ view, viewSet ] = useState(null);

	// Called to fetch records
	function fetch(filter) {

		// If it's empty
		if(empty(filter)) {
			recordsSet([]);
			return;
		}

		// If we have a range, convert it
		if(filter.range) {
			filter.range[0] = timestamp(filter.range[0] + ' 00:00:00', false);
			filter.range[1] = timestamp(filter.range[1] + ' 23:59:59', false);
		}

		// Fetch from the server
		recordsSet(false);
		blog.read('admin/posts/filter', filter).then(recordsSet, error => {
			onError(error);
		});
	}

	// Called after new post is uploaded
	function postAdded(file) {

		// Add it to the records
		recordsSet(l => {
			const lRecords = clone(l);
			lRecords.unshift(file);
			return lRecords;
		});

		// Hide the form
		addSet(false);
	}

	// Called to delete the currently set `remove` post
	function postRemove() {

		// Send the delete request to the server
		blog.delete('admin/post', {
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

