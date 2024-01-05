/**
 * Meta
 *
 * Handles setting meta tags for a post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-03
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Project components
import MediaSelect from './MediaSelect';

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
export default function Meta({ allowed, errors, locale, onChange, value }) {

	// State
	const [ imageSelect, imageSelectSet ] = useState(false);

	// Called when any state value changes
	function valueChange(which, val) {
		const oNew = { ...value };
		if(val.trim() === '') {
			delete oNew[which];
		} else {
			oNew[which] = val;
		}
		onChange(oNew);
	}

	// Render
	const _ = TEXT[locale];
	return (
		<Box className="blog_meta_form">
			<Typography className="legend">{_.title}</Typography>
			<br />
			{allowed.includes('title') &&
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
						value={value.title || ''}
						variant="outlined"
					/>
				</Box>
			}
			{allowed.includes('description') &&
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
						value={value.description || ''}
						variant="outlined"
					/>
				</Box>
			}
			{allowed.includes('image') &&
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
							value={value.image || ''}
							variant="outlined"
						/>
					</Box>
					<Box className="blog_meta_form_image_icon">
						<i
							className="fa-solid fa-upload"
							onClick={() => imageSelectSet(value.image)}
						/>
					</Box>
				</Box>
			}
			{allowed.includes('url') &&
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
						value={value.url || ''}
						variant="outlined"
					/>
				</Box>
			}
			{imageSelect !== false &&
				<MediaSelect
					callback={image => {
						valueChange('image', image);
						imageSelectSet(false);
					}}
					current={imageSelect}
					onClose={() => imageSelectSet(false)}
					locale={locale}
				/>
			}
		</Box>
	);
}

// Valid props
Meta.propTypes = {
	allowed: PropTypes.arrayOf(PropTypes.string).isRequired,
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