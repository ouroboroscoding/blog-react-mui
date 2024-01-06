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
// Project modules
import Translation from '../../translations';
// Local pages
import Categories from './Categories';
import Edit from './Edit';
import Home from './Home';
import Media from './Media';
import New from './New';
import Published from './Published';
// Styling
import '../../sass/blog.scss';
// Tab indexes to types
const TAB_MAP = {
    none: -101,
    invalid: -100,
    edit: -1,
    home: 0,
    new: 1,
    published: 2,
    categories: 3,
    media: 4
};
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
export default function Blog({ allowedMeta, basePath, baseURL, locale }) {
    // State
    const [tab, tabSet] = useState(TAB_MAP.none);
    const [id, idSet] = useState(null);
    // Hooks
    const location = useLocation();
    const navigate = useNavigate();
    // Locale effect
    useEffect(() => {
        // Set the locale for the translations
        Translation.set(locale);
    }, [locale]);
    useEffect(() => {
        // If the pathname ends with a slash
        if (location.pathname.slice(-1) === '/') {
            navigate(location.pathname.slice(0, -1), { replace: true });
            return;
        }
        // If we're at the root
        if (location.pathname === basePath) {
            tabSet(TAB_MAP.home);
        }
        // Else, if the location is categories
        else if (location.pathname === `${basePath}/categories`) {
            tabSet(TAB_MAP.categories);
        }
        // Else, if the location is media
        else if (location.pathname === `${basePath}/media`) {
            tabSet(TAB_MAP.media);
        }
        // Else, if the location is new
        else if (location.pathname === `${basePath}/new`) {
            tabSet(TAB_MAP.new);
        }
        // Else, if the location is published
        else if (location.pathname === `${basePath}/published`) {
            tabSet(TAB_MAP.published);
        }
        // Else, if the location is an exist post
        else if (location.pathname.substring(basePath.length, basePath.length + 5) === '/edit') {
            tabSet(TAB_MAP.edit);
            idSet(location.pathname.slice(-36));
        }
        // Else, unknown location
        else {
            tabSet(TAB_MAP.invalid);
        }
    }, [basePath, location, navigate]);
    // Until we have a tab, even a 404, do nothing
    if (tab === TAB_MAP.none) {
        return null;
    }
    // Set proper translation object
    const _ = Translation.get();
    // Render
    return (React.createElement(Box, { id: "blog" },
        React.createElement(Tabs, { id: "blog_tabs", value: tab < 0 ? false : tab, onChange: (ev, i) => tabSet(i) },
            React.createElement(Tab, { className: tab === TAB_MAP.home ? 'selected' : '', label: _.tabs.home, component: Link, to: basePath }),
            React.createElement(Tab, { className: tab === TAB_MAP.new ? 'selected' : '', label: _.tabs.new, component: Link, to: `${basePath}/new` }),
            React.createElement(Tab, { className: tab === TAB_MAP.published ? 'selected' : '', label: _.tabs.published, component: Link, to: `${basePath}/published` }),
            React.createElement(Tab, { className: tab === TAB_MAP.categories ? 'selected' : '', label: _.tabs.categories, component: Link, to: `${basePath}/categories` }),
            React.createElement(Tab, { className: tab === TAB_MAP.media ? 'selected' : '', label: _.tabs.media, component: Link, to: `${basePath}/media` })),
        React.createElement(Box, { id: "blog_content" }, (tab === TAB_MAP.home &&
            React.createElement(Home, { basePath: basePath })) || (tab === TAB_MAP.new &&
            React.createElement(New, { allowedMeta: allowedMeta, basePath: basePath, baseURL: baseURL })) || (tab === TAB_MAP.published &&
            React.createElement(Published, { basePath: basePath })) || (tab === TAB_MAP.categories &&
            React.createElement(Categories, { baseURL: baseURL })) || (tab === TAB_MAP.media &&
            React.createElement(Media, null)) || (tab === TAB_MAP.edit &&
            React.createElement(Edit, { _id: id, allowedMeta: allowedMeta, baseURL: baseURL })) || (tab === TAB_MAP.invalid &&
            React.createElement(Box, { className: "padding" },
                React.createElement(Typography, null, _.tabs.invalid.replace('{path}', location.pathname)))))));
}
// Valid props
Blog.propTypes = {
    allowedMeta: PropTypes.arrayOf(PropTypes.string),
    basePath: PropTypes.string,
    baseURL: PropTypes.string,
    locale: PropTypes.string
};
// Default props
Blog.defaultProps = {
    allowedMeta: ['title', 'description', 'image', 'url'],
    basePath: '/blog',
    baseURL: 'http://localhost',
    locale: 'en-US'
};
