/**
 * Media View
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */
// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { bytesHuman } from '@ouroboros/tools';
import { copy } from '@ouroboros/browser/clipboard';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Project modules
import Translation from '../../../translations';
// Project components
import ConfirmDelete from '../../elements/ConfirmDelete';
/**
 * Media View
 *
 * Handles uploading new media
 *
 * @name View
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function View({ onClose, onThumbAdded, onThumbRemoved, value }) {
    // Text
    const _ = Translation.get().media;
    // State
    const [err, errSet] = useState(false);
    const [thumb, thumbSet] = useState(null);
    // Called to add the new thumbnail
    function thumbAdd() {
        // Fill the form
        thumbSet({
            type: 'f',
            height: Math.round(value.image.resolution.height / 2),
            chain: true,
            width: Math.round(value.image.resolution.width / 2)
        });
    }
    // Called when a thumbnail changes
    function thumbChange(type, val) {
        // Make sure we're up to date
        thumbSet(o => {
            // Init new values
            const oNew = clone(o);
            // If we're changing the height or width
            if (type === 'height' || type === 'width') {
                // Make sure we have an int
                val = parseInt(val, 10);
                // If it's higher than it's equivalent file dimension, set it to
                //	that
                if (val > value.image.resolution[type]) {
                    val = value.image.resolution[type];
                }
                // If we're chained
                if (o.chain) {
                    // If we're changing the height
                    if (type === 'height') {
                        // Get the percentage of the height based on the image height
                        const fPerc = value.image.resolution.height / val;
                        // Set new values
                        oNew.width = Math.round(value.image.resolution.width / fPerc);
                    }
                    // Else, if we're changing the width
                    else {
                        // Get the percentage of the height based on the image height
                        const fPerc = value.image.resolution.width / val;
                        // Set new values
                        oNew.height = Math.round(value.image.resolution.height / fPerc);
                    }
                }
            }
            // If we're changing the type
            if (type === 'type') {
                // If the new value is crop, turn off chaining
                if (val === 'c') {
                    oNew.chain = false;
                }
            }
            // Add the new value
            oNew[type] = val;
            // Merge the new data and return
            return oNew;
        });
    }
    // Called to delete an existing thumbnail
    function thumbDelete(size) {
        // Send the request to the server
        blog.delete('admin/media/thumbnail', {
            _id: value._id,
            size
        }).then(data => {
            if (data) {
                onThumbRemoved(size);
            }
        }, error => {
            events.get('error').trigger(error);
        });
    }
    // Called to generate a new thumbnail
    function thumbSubmit() {
        // Create the size
        const sSize = `${thumb.type}${thumb.width}x${thumb.height}`;
        // Send the request to the server
        blog.create('admin/media/thumbnail', {
            _id: value._id,
            size: sSize
        }).then(data => {
            if (data) {
                thumbSet(null);
                onThumbAdded(sSize, data);
            }
        }, error => {
            if (error.code === errors.body.DB_DUPLICATE) {
                errSet(_.add.thumb.duplicate);
            }
            else {
                events.get('error').trigger(error);
            }
        });
    }
    // Render
    return (React.createElement(Dialog, { fullScreen: true, id: "blog_media_view", onClose: onClose, open: true },
        React.createElement(DialogContent, { className: "blog_media_view" },
            React.createElement("i", { className: "fa-solid fa-times-circle close", onClick: onClose }),
            React.createElement(Box, { className: "blog_media_view_content" }, value.image ?
                React.createElement(Box, { className: "blog_media_view_photo", style: { backgroundImage: `url(${value.urls.source})` } })
                :
                    React.createElement("iframe", { className: "blog_media_view_file", src: value.urls.source, title: value.filename })),
            React.createElement(Box, { className: "blog_media_view_details" },
                React.createElement(Box, { className: "blog_media_view_details_left" },
                    React.createElement(Typography, null,
                        _.details.filename,
                        React.createElement("br", null),
                        _.details.mime,
                        React.createElement("br", null),
                        _.details.size,
                        React.createElement("br", null),
                        value.image &&
                            React.createElement(React.Fragment, null,
                                _.details.dimensions,
                                React.createElement("br", null)),
                        value.image && value.image.thumbnails &&
                            React.createElement(React.Fragment, null,
                                _.details.thumbnails,
                                "\u00A0",
                                React.createElement("i", { className: "fa-solid fa-plus " +
                                        (thumb !== null ? ' open' : ''), onClick: () => thumb !== null ?
                                        thumbSet(null) : thumbAdd() })))),
                React.createElement(Box, { className: "blog_media_view_details_right" },
                    React.createElement(Typography, null,
                        React.createElement("span", { className: "nobr" },
                            React.createElement("i", { className: "fa-solid fa-copy", onClick: () => {
                                    copy(value.urls.source).then(() => {
                                        events.get('success').trigger(_.url_copied);
                                    });
                                } }),
                            React.createElement("a", { href: value.urls.source, rel: "noreferrer", target: "_blank" }, value.filename)),
                        React.createElement("br", null),
                        React.createElement("span", { className: "nobr" }, value.mime),
                        React.createElement("br", null),
                        React.createElement("span", { className: "nobr" }, bytesHuman(value.length)),
                        React.createElement("br", null),
                        value.image &&
                            React.createElement(React.Fragment, null,
                                React.createElement("span", { className: "nobr" }, `${value.image.resolution.width}x${value.image.resolution.height}`),
                                React.createElement("br", null)),
                        value.image && value.image.thumbnails && value.image.thumbnails.map(s => React.createElement("span", { key: s, className: "blog_media_thumb" },
                            React.createElement("i", { className: "fa-solid fa-copy", onClick: () => {
                                    copy(value.urls[s]).then(() => {
                                        events.get('success').trigger(_.url_copied);
                                    });
                                } }),
                            React.createElement("a", { href: value.urls[s], rel: "noreferrer", target: "_blank" },
                                s[0] === 'f' ? _.add.thumb.fit : _.add.thumb.crop,
                                " ",
                                s.substring(1)),
                            React.createElement(ConfirmDelete, { onConfirm: () => thumbDelete(s) })))))),
            value.image &&
                React.createElement(Box, { className: "blog_media_upload_thumbs" }, thumb !== null &&
                    React.createElement(Box, { className: "blog_media_upload_thumb" },
                        React.createElement(FormControl, { className: "blog_thumb_type" },
                            React.createElement(InputLabel, { id: value._id }, _.add.thumb.type),
                            React.createElement(Select, { label: _.add.thumb.type, labelId: value._id, onChange: ev => thumbChange('type', ev.target.value), native: true, size: "small", value: thumb.type },
                                React.createElement("option", { value: "f" }, _.add.thumb.fit),
                                React.createElement("option", { value: "c" }, _.add.thumb.crop))),
                        React.createElement(TextField, { className: "blog_thumb_dimension", InputProps: { inputProps: { min: 1, max: value.image.resolution.width } }, label: _.add.thumb.width, onChange: ev => thumbChange('width', ev.target.value), placeholder: _.add.thumb.width, size: "small", type: "number", value: thumb.width }),
                        React.createElement("i", { className: 'blog_thumb_chain fa-solid ' + (thumb.chain ? 'fa-link' : 'fa-link-slash'), onClick: () => thumbChange('chain', !thumb.chain) }),
                        React.createElement(TextField, { className: "blog_thumb_dimension", InputProps: { inputProps: { min: 1, max: value.image.resolution.height } }, label: _.add.thumb.height, onChange: ev => thumbChange('height', ev.target.value), placeholder: _.add.thumb.height, size: "small", type: "number", value: thumb.height }),
                        React.createElement(Button, { color: "primary", onClick: thumbSubmit, variant: "contained" },
                            React.createElement("i", { className: "fa-solid fa-plus" })),
                        err &&
                            React.createElement(Box, { className: "error" }, err))))));
}
// Valid props
View.propTypes = {
    onClose: PropTypes.func.isRequired,
    onThumbAdded: PropTypes.func.isRequired,
    onThumbRemoved: PropTypes.func.isRequired,
    rights: PropTypes.exact({
        create: PropTypes.bool,
        delete: PropTypes.bool,
        read: PropTypes.bool,
        update: PropTypes.bool
    }).isRequired,
    value: PropTypes.object.isRequired
};
