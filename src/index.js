/**
 * Blog
 *
 * Primary entry into blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */

// Ouroboros modules
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// Local pages
import Media from './Media';

// Styling
import './sass.scss';

// Translations
import TEXT from './text';

// Tab indexes to types
const TAB_MAP = {
	invalid: -1,
	home: 0,
	media: 1
}

/**
 * Blog
 *
 * Handles mapping of routers in types path
 *
 * @name Blog
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Blog({ base_path, locale, onError }) {

	// State
	const [ tab, tabSet ] = useState(TAB_MAP.home);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {

		// If the pathname ends with a slash
		if(location.pathname.slice(-1) === '/') {
			navigate(location.pathname.slice(0, -1), { replace: true });
			return;
		}

		// If we're at the root
		if(location.pathname === base_path) {
			tabSet(TAB_MAP.home);
		}

		// Else, if the location is media
		else if(location.pathname === `${base_path}/media`) {
			tabSet(TAB_MAP.media);
		}

		// Else, unknown location
		else {
			tabSet(TAB_MAP.invalid);
			events.get('errors').trigger(
				TEXT[locale].tab_invalid.replace('{path}', location.pathname)
			);
		}

	}, [base_path, locale, location, navigate]);

	// Set proper translation object
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog">
			<Tabs id="blog_tabs" value={tab} onChange={(ev, i) => tabSet(i)}>
				<Tab
					className={tab === TAB_MAP.home ? 'selected' : ''}
					label={_.tab_home}
					component={Link}
					to={base_path}
				/>
				<Tab
					className={tab === TAB_MAP.media ? 'selected' : ''}
					label={_.tab_media}
					component={Link}
					to={`${base_path}/media`}
				/>
			</Tabs>
			{(tab === TAB_MAP.home &&
				<Box id="blog_home">
					<Typography>{_.home_message}</Typography>
				</Box>
			) || (tab === TAB_MAP.media &&
				<Media
					locale={locale}
					onError={onError}
				/>
			)}
		</Box>
	);
}

// Valid props
Blog.propTypes = {
	base_path: PropTypes.string,
	locale: PropTypes.string,
	onError: PropTypes.func
}

// Default props
Blog.defaultProps = {
	base_path: '/blog',
	locale: 'en-US',
	onError: error => {
		throw new Error(JSON.stringify(error, null, 4));
	}
}