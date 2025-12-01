/**
 * Media Select
 *
 * Handles selecting the timeline or filename to fetch media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-03
 */
// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
// Project modules
import Translation from '../../translations';
// Project components
import MediaFilter from './MediaFilter';
/**
 * Media Select
 *
 * Handles UI to select media
 *
 * @name MediaSelect
 * @access public
 * @extends React.Component
 */
export default function MediaSelect({ callback, current, onClose }) {
    // Text
    const _ = Translation.get().media_select;
    // State
    const [images, imagesSet] = useState(false);
    // Hooks
    const fullScreen = useMediaQuery('(max-width:600px)');
    // Render
    return (React.createElement(Dialog, { fullScreen: fullScreen, fullWidth: true, id: "blog_post_media_select", maxWidth: "lg", onClose: onClose, open: true },
        React.createElement(DialogTitle, null, _.title),
        React.createElement(DialogContent, null,
            React.createElement(MediaFilter, { imagesOnly: true, onRecords: imagesSet }),
            React.createElement("br", null),
            (images === false &&
                React.createElement(DialogContentText, null, "...")) || (images.length === 0 &&
                React.createElement(DialogContentText, null, _.no_records)) ||
                React.createElement(Box, { className: "blog_post_media_select_records" }, images.map(o => React.createElement(Paper, { className: "blog_post_media_select_record", key: o._id },
                    React.createElement(Box, { className: "blog_post_media_select_record_image", style: { backgroundImage: `url(${o.urls.source})` } }),
                    React.createElement(Box, { className: "blog_post_media_select_record_urls" },
                        React.createElement(Button, { color: o.urls.source === current ? 'info' : 'primary', onClick: () => callback(o.urls.source), variant: "contained" }, _.source),
                        React.createElement("br", null),
                        o.image && o.image.thumbnails.map(s => React.createElement(React.Fragment, { key: s },
                            React.createElement(Button, { color: o.urls[s] === current ? 'info' : 'primary', onClick: () => callback(o.urls[s]), variant: "contained" },
                                s[0] === 'f' ? _.fit : _.crop,
                                " ",
                                s.substring(1)),
                            React.createElement("br", null))))))))));
}
// Valid props
MediaSelect.propTypes = {
    callback: PropTypes.func.isRequired,
    current: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};
