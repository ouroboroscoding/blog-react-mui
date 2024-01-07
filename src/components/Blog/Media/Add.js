/**
 * Media Add
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */
// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
import { afindi, arrayFindDelete, bytesHuman, pathToTree } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
// Project modules
import Translation from '../../../translations';
// Local components
import Upload from './Upload';
/**
 * Media Add
 *
 * Handles uploading new media
 *
 * @name Add
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Add({ onAdded, onCancel, open }) {
    // Text
    const _ = Translation.get().media;
    // State
    const [errs, errsSet] = useState({});
    const [upload, uploadSet] = useState(null);
    const [thumbs, thumbsSet] = useState([]);
    // Hooks
    const mobile = useMediaQuery('(max-width:400px)');
    // Called to add a thumbnail
    function thumbAdd() {
        thumbsSet(l => {
            const lThumbs = clone(l);
            lThumbs.push({
                key: uuidv4(),
                chain: true,
                type: 'f',
                height: Math.round(upload.dimensions.height / 2),
                width: Math.round(upload.dimensions.width / 2)
            });
            return lThumbs;
        });
    }
    // Called when a thumbnail changes
    function thumbChange(key, type, val) {
        // Make sure we're up to date
        thumbsSet(l => {
            // Clone the thumbs
            const lThumbs = clone(l);
            // Find the record
            const iThumb = afindi(l, 'key', key);
            // If it doesn't exist, do nothing
            if (iThumb === -1) {
                return l;
            }
            // Init new values
            const o = clone(lThumbs[iThumb]);
            // If we're changing the height or width
            if (type === 'height' || type === 'width') {
                // Make sure we have an int
                val = parseInt(val, 10);
                // If it's higher than it's equivalent file dimension, set it to
                //	that
                if (val > upload.dimensions[type]) {
                    val = upload.dimensions[type];
                }
                // If we're linked
                if (lThumbs[iThumb].link) {
                    // If we're changing the height
                    if (type === 'height') {
                        // Get the percentage of the height based on the image height
                        const fPerc = upload.dimensions.height / val;
                        // Set new values
                        o.width = Math.round(upload.dimensions.width / fPerc);
                    }
                    // Else, if we're changing the width
                    else {
                        // Get the percentage of the height based on the image height
                        const fPerc = upload.dimensions.width / val;
                        // Set new values
                        o.height = Math.round(upload.dimensions.height / fPerc);
                    }
                }
            }
            // Add the new value
            o[type] = val;
            // Merge the new data and return
            lThumbs[iThumb] = o;
            return lThumbs;
        });
    }
    // Called to remove a thumbnail
    function thumbRemove(key) {
        thumbsSet(l => arrayFindDelete(l, 'key', key, true));
    }
    // Called when the photo changes
    function uploadChange(data) {
        // Split the URL
        const lData = data.url.split(';');
        // Change the data
        uploadSet({
            data: lData[1].substring(7),
            dimensions: data.file.dimensions,
            name: data.file.name.replace(/ /g, '_'),
            mime: data.file.type,
            length: data.file.size,
            type: data.file.type,
            url: data.url
        });
    }
    // Called to upload the file
    function uploadSubmit() {
        // Clear errors
        errsSet({});
        // Generate the data
        const oData = {
            base64: upload.data,
            filename: upload.name
        };
        // If we have thumbs
        if (thumbs.length) {
            // Generate the string for each thumb
            oData.thumbnails = thumbs.map(o => `${o.type}${o.width}x${o.height}`);
        }
        // Make the request to the server
        blog.create('admin/media', oData).then(data => {
            // Pass along the data tp the parent
            onAdded(data);
            // Clear the local data
            uploadSet(null);
            thumbsSet([]);
        }, error => {
            if (error.code === errors.body.DATA_FIELDS) {
                errsSet(pathToTree(error.msg));
            }
            else if (error.code === errors.body.DB_DUPLICATE) {
                errsSet({ duplicate: true });
            }
            else {
                events.get('error').trigger(error);
            }
        });
    }
    // Render
    return (React.createElement(Dialog, { fullScreen: mobile, id: "blog_media_upload_modal", onClose: onCancel, open: open },
        React.createElement(DialogTitle, null, _.add.title),
        React.createElement(DialogContent, null,
            React.createElement(Upload, { element: ({ file, click, drag }) => {
                    return file ? (React.createElement(Box, { className: "blog_media_upload" },
                        (file.type === 'image/jpeg' || file.type === 'image/png') ? (React.createElement(Box, { className: "blog_media_upload_photo", style: { backgroundImage: `url(${file.url})` } },
                            React.createElement("i", { className: "fas fa-times-circle close", onClick: () => { uploadSet(null); thumbsSet([]); } }))) : (React.createElement(Box, { className: "blog_media_upload_photo" },
                            React.createElement("i", { className: "fas fa-times-circle close", onClick: () => { uploadSet(null); thumbsSet([]); } }),
                            React.createElement("i", { className: "mime fa-solid fa-file" }))),
                        React.createElement(Box, { className: "blog_media_upload_details" },
                            React.createElement(Box, { className: "blog_media_upload_details_left" },
                                React.createElement(Typography, null,
                                    _.details.filename,
                                    React.createElement("br", null),
                                    _.details.mime,
                                    React.createElement("br", null),
                                    _.details.size,
                                    React.createElement("br", null),
                                    file.dimensions && [
                                        _.details.dimensions,
                                        React.createElement("br", null)
                                    ])),
                            React.createElement(Box, { className: "blog_media_upload_details_right" },
                                React.createElement(Typography, null,
                                    file.name,
                                    React.createElement("br", null),
                                    file.type,
                                    React.createElement("br", null),
                                    bytesHuman(file.length),
                                    React.createElement("br", null),
                                    file.dimensions && [
                                        `${file.dimensions.width}x${file.dimensions.height}`,
                                        React.createElement("br", null)
                                    ]))),
                        ['image/jpeg', 'image/png'].includes(file.type) &&
                            React.createElement(Box, { className: "blog_media_upload_thumbs" },
                                React.createElement(Box, { className: "blog_media_upload_details" },
                                    React.createElement(Box, { className: "blog_media_upload_details_left" },
                                        React.createElement(Typography, null, _.details.thumbnails)),
                                    React.createElement(Box, { className: "blog_media_upload_details_right" },
                                        React.createElement("i", { className: "fa-solid fa-plus link", onClick: thumbAdd }))),
                                thumbs && thumbs.map(o => React.createElement(Box, { key: o.key, className: "blog_media_upload_thumb" },
                                    React.createElement(FormControl, { className: "blog_thumb_type" },
                                        React.createElement(InputLabel, { id: o.key }, _.add.thumb.type),
                                        React.createElement(Select, { label: _.add.thumb.type, labelId: o.key, onChange: ev => thumbChange(o.key, 'type', ev.target.value), native: true, size: "small", value: o.type },
                                            React.createElement("option", { value: "f" }, _.add.thumb.fit),
                                            React.createElement("option", { value: "c" }, _.add.thumb.crop))),
                                    React.createElement(TextField, { className: "blog_thumb_dimension", InputProps: { inputProps: { min: 1, max: file.dimensions.width } }, label: _.add.thumb.width, onChange: ev => thumbChange(o.key, 'width', ev.target.value), placeholder: _.add.thumb.width, size: "small", type: "number", value: o.width }),
                                    React.createElement("i", { className: 'blog_thumb_chain fa-solid ' + (o.chain ? 'fa-link' : 'fa-link-slash'), onClick: () => thumbChange(o.key, 'chain', !o.chain) }),
                                    React.createElement(TextField, { className: "blog_thumb_dimension", InputProps: { inputProps: { min: 1, max: file.dimensions.height } }, label: _.add.thumb.height, onChange: ev => thumbChange(o.key, 'height', ev.target.value), placeholder: _.add.thumb.height, size: "small", type: "number", value: o.height }),
                                    React.createElement("i", { className: "blog_thumb_remove fa-solid fa-trash-alt", onClick: () => thumbRemove(o.key) }),
                                    React.createElement("br", null)))),
                        'duplicate' in errs &&
                            React.createElement(Typography, { className: "error" }, _.add.duplicate))) : (React.createElement(Box, { className: "blog_media_upload_text link", onClick: click, ...drag },
                        React.createElement(Typography, { className: "link" }, _.add.descr)));
                }, maxFileSize: 10485760, onChange: uploadChange, value: upload })),
        React.createElement(DialogActions, null,
            React.createElement(Button, { color: "secondary", onClick: onCancel, variant: "contained" }, _.add.cancel),
            upload &&
                React.createElement(Button, { color: "primary", onClick: uploadSubmit, variant: "contained" }, _.add.upload))));
}
// Valid props
Add.propTypes = {
    onAdded: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
