/**
 * Edit Post
 *
 * Holds the component for updated or adding to an existing post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-23
 */

// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { locales as Locales } from '@ouroboros/mouth-mui';
import { afindo, empty, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project components
import HTML from '../../elements/HTML';
import Tags from '../../elements/Tags';

// Project modules
import categoryTitle from '../../../functions/categoryTitle';
import titleToSlug from '../../../functions/titleToSlug';

// Translations
import TEXT from '../../../translations/edit_post';

/**
 * Edit
 *
 * Handles the Edit component for updated a blog post
 *
 * @name Edit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Edit({ _id, baseURL, locale, onError }) {

	// Render
	return (
		<Box id="blog_post_edit">
			{_id}
		</Box>
	);
}

// Valid props
Edit.propTypes = {
	_id: PropTypes.string.isRequired,
	baseURL: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	onError: PropTypes.func.isRequired
}