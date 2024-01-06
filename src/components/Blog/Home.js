/**
 * Home
 *
 * Home page of blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-28
 */
// Ouroboros modules
import blog from '@ouroboros/blog';
import { useRights } from '@ouroboros/brain-react';
import events from '@ouroboros/events';
import { arrayFindDelete } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Project modules
import localeTitle from '../../functions/localeTitle';
import Translation from '../../translations';
// Styling
import '../../sass/blog.scss';
/**
 * Home
 *
 * Handles mapping of routers in types path
 *
 * @name Home
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Home({ basePath }) {
    // Text
    const _ = Translation.get().home;
    // State
    const [remove, removeSet] = useState(null);
    const [unpublished, unpublishedSet] = useState(false);
    // Hooks
    const rights = useRights('blog_post');
    // Load effect
    useEffect(() => {
        // Fetch unpublished
        blog.read('admin/post/unpublished').then(data => {
            if (data) {
                unpublishedSet(data);
            }
        }, err => events.get('error').trigger(err));
    }, []);
    // Called to delete the currently set `remove` post
    function postRemove() {
        // Send the delete request to the server
        blog.delete('admin/post', {
            _id: remove._id
        }).then(data => {
            if (data) {
                unpublishedSet(l => arrayFindDelete(l, '_id', remove._id, true));
                removeSet(null);
                events.get('success').trigger(_.remove.success);
            }
        }, error => {
            events.get('error').trigger(error);
        });
    }
    // Render
    return (React.createElement(Box, { id: "blog_home" },
        React.createElement(Typography, null, _.message),
        unpublished !== false && unpublished.length > 0 &&
            React.createElement(Box, { className: "blog_home_unpublished" },
                React.createElement(Typography, { variant: "h3" }, _.unpublished.title),
                React.createElement(Grid, { container: true, spacing: 2 }, unpublished.map(o => React.createElement(Grid, { key: o._id, item: true, xs: 12, md: 6, lg: 4, xl: 3 },
                    React.createElement(Paper, { className: "blog_home_unpublished_post" },
                        React.createElement(Box, { className: "unpublished_post_text" },
                            React.createElement(Typography, { className: "post_title" }, localeTitle(o))),
                        React.createElement(Box, { className: "unpublished_post_actions" },
                            rights.update &&
                                React.createElement(Link, { to: `${basePath}/edit/${o._id}` },
                                    React.createElement("i", { className: "fa-solid fa-edit" })),
                            rights.delete &&
                                React.createElement("i", { className: "fa-solid fa-trash-alt", onClick: () => removeSet(o) }))))))),
        remove !== null &&
            React.createElement(Dialog, { id: "blog_post_delete", onClose: () => removeSet(null), open: true },
                React.createElement(DialogTitle, null, _.remove.title.replace('{TITLE}', localeTitle(remove))),
                React.createElement(DialogContent, null,
                    React.createElement(DialogContentText, null, _.remove.confirm.replace('{TITLE}', localeTitle(remove)))),
                React.createElement(DialogActions, null,
                    React.createElement(Button, { color: "secondary", onClick: postRemove, variant: "contained" }, _.remove.button)))));
}
// Valid props
Home.propTypes = {
    basePath: PropTypes.string.isRequired
};
