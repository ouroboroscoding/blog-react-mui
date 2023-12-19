/**
 * New Post
 *
 * Holds the component for creating a new blog post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

// Material UI
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// Project components
import HTML from '../../composites/HTML';

// Translations
import TEXT from './text';

/**
 * New
 *
 * Handles the New component for creating a blog post
 *
 * @name New
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function New({ locale, onError }) {

	// State
	const [ error, errorSet ] = useState(false);

	// Hooks
	const fullScreen = useMediaQuery('(max-width:600px)');

	// Refs
	const refHtml = useRef(null);

	// Text
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog_new_post">
			<HTML
				error={error}
				fullScreen={fullScreen}
				locale={locale}
				onError={onError}
				ref={refHtml}
			/>
		</Box>
	);
}

// Valid props
New.propTypes = {
	locale: PropTypes.string,
	onError: PropTypes.func
}