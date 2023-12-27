/**
 * Blog
 *
 * Primary entry into blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */

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
import Categories from './Categories';
import Edit from './Edit';
import Media from './Media';
import New from './New';

// Styling
import '../../sass/blog.scss';

// Translations
import TEXT from '../../translations/blog';

// Tab indexes to types
const TAB_MAP = {
	invalid: -1,
	home: 0,
	new: 1,
	categories: 2,
	media: 3
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
export default function Blog({ basePath, baseURL, locale }) {

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
		if(location.pathname === basePath) {
			tabSet(TAB_MAP.home);
		}

		// Else, if the location is categories
		else if(location.pathname === `${basePath}/categories`) {
			tabSet(TAB_MAP.categories);
		}

		// Else, if the location is media
		else if(location.pathname === `${basePath}/media`) {
			tabSet(TAB_MAP.media);
		}

		// Else, if the location is new
		else if(location.pathname === `${basePath}/new`) {
			tabSet(TAB_MAP.new);
		}

		// Else, if the location is an exist post
		else if(location.pathname.substring(basePath.length, basePath.length + 5) === '/edit') {
			tabSet(TAB_MAP.edit);
		}

		// Else, unknown location
		else {
			tabSet(TAB_MAP.invalid);
		}

	}, [basePath, locale, location, navigate]);

	// Set proper translation object
	const _ = TEXT[locale];

	// Render
	return (
		<Box id="blog">
			<Tabs id="blog_tabs" value={tab} onChange={(ev, i) => tabSet(i)}>
				<Tab
					className={tab === TAB_MAP.home ? 'selected' : ''}
					label={_.tab.home}
					component={Link}
					to={basePath}
				/>
				<Tab
					className={tab === TAB_MAP.new ? 'selected' : ''}
					label={_.tab.new}
					component={Link}
					to={`${basePath}/new`}
				/>
				<Tab
					className={tab === TAB_MAP.categories ? 'selected' : ''}
					label={_.tab.categories}
					component={Link}
					to={`${basePath}/categories`}
				/>
				<Tab
					className={tab === TAB_MAP.media ? 'selected' : ''}
					label={_.tab.media}
					component={Link}
					to={`${basePath}/media`}
				/>
			</Tabs>
			<Box id="blog_content">
				{(tab === TAB_MAP.home &&
					<Box id="blog_home">
						<Typography>{_.home_message}</Typography>
					</Box>
				) || (tab === TAB_MAP.new &&
					<New
						basePath={basePath}
						baseURL={baseURL}
						locale={locale}
					/>
				) || (tab === TAB_MAP.categories &&
					<Categories
						baseURL={baseURL}
						locale={locale}
					/>
				) || (tab === TAB_MAP.media &&
					<Media
						locale={locale}
					/>
				) || (tab === TAB_MAP.edit &&
					<Edit
						_id={location.pathname.slice(-36)}
						baseURL={baseURL}
						locale={locale}
					/>
				) || (tab === TAB_MAP.invalid &&
					<Box className="padding">
						<Typography>
							{_.tab.invalid.replace('{path}', location.pathname)}
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}

// Valid props
Blog.propTypes = {
	basePath: PropTypes.string,
	baseURL: PropTypes.string,
	locale: PropTypes.string
}

// Default props
Blog.defaultProps = {
	basePath: '/blog',
	baseURL: 'http://localhost',
	locale: 'en-US'
}