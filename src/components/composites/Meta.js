/**
 * Meta
 *
 * Handles setting meta tags for a post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-03
 */

// Ouroboros modules
import { increment, iso, timestamp } from '@ouroboros/dates';
import clone from '@ouroboros/clone';
import { compare, empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Translations
import TEXT from '../../translations/meta';

/**
 * Meta
 *
 * Handles UI to filter media
 *
 * @name Meta
 * @access public
 */
export default function Meta({ errors, locale, onChange, value }) {

	// State
	const [ state, stateSet ] = useState(value || {});

	// Value effect
	useEffect(() => {
		stateSet(value);
	}, [value]);

	// Called when any state value changes
	function valueChange(which, val) {
		stateSet(o => {
			const oNew = { ...o };
			oNew[which] = val;
			return oNew;
		}, newState => {
			onChange(newState);
		})
	}

	// Render
	const _ = TEXT[locale];
	return (
		<Box className="blog_meta_form">
			<Typography className="legend">{_.title}</Typography>
			<br />
			<Box className="field">
				<TextField
					error={'title' in errors}
					helperText={errors.title || ''}
					InputLabelProps={{
						shrink: true,
					}}
					label={_.labels.title}
					onChange={ev => valueChange('title', ev.target.value)}
					placeholder={_.placeholders.title}
					variant="outlined"
				/>
			</Box>
			<Box className="field">
				<TextField
					error={'description' in errors}
					helperText={errors.description || ''}
					InputLabelProps={{
						shrink: true,
					}}
					label={_.labels.description}
					multiline={true}
					onChange={ev => valueChange('description', ev.target.value)}
					placeholder={_.placeholders.description}
					variant="outlined"
				/>
			</Box>
			<Box className="blog_meta_form_image">
				<Box className="blog_meta_form_image_text field">
					<TextField
						error={'image' in errors}
						helperText={errors.image || ''}
						InputLabelProps={{
							shrink: true,
						}}
						label={_.labels.image}
						onChange={ev => valueChange('image', ev.target.value)}
						placeholder={_.placeholders.image}
						variant="outlined"
					/>
				</Box>
				<Box className="blog_meta_form_image_icon">
					<i className="fa-solid fa-upload" />
				</Box>
			</Box>
			<Box className="field">
				<TextField
					error={'url' in errors}
					helperText={errors.url || ''}
					InputLabelProps={{
						shrink: true,
					}}
					label={_.labels.url}
					multiline={true}
					onChange={ev => valueChange('url', ev.target.value)}
					placeholder={_.placeholders.url}
					variant="outlined"
				/>
			</Box>
		</Box>
	);
}

// Valid props
Meta.propTypes = {
	errors: PropTypes.exact({
		description: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
		url: PropTypes.string
	}),
	locale: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.exact({
		description: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
		url: PropTypes.string
	})
}

// Default props
Meta.defaultProps = {
	errors: {},
	value: {}
}