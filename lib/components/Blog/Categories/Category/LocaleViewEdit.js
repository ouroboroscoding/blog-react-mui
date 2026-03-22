/**
 * Category Locale View/Edit
 *
 * Handles displaying a single locale within a category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-15
 */
// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { DefineParent } from '@ouroboros/define-mui';
import events from '@ouroboros/events';
import { afindo, pathToTree } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// Project modules
import Translation from '../../../../translations';
// Project components
import ConfirmDelete from '../../../elements/ConfirmDelete';
/**
 * Category Locale View/Edit
 *
 * Handles viewing and editing of a single category locale
 *
 * @name LocaleViewEdit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function LocaleViewEdit({ baseURL, count, locales, onDeleted, onUpdated, rights, tree, value }) {
    // Text
    const _ = Translation.get().categories;
    // State
    const [edit, editSet] = useState(false);
    // Refs
    const refForm = useRef(null);
    // Called to delete the locale record
    function remove() {
        // Send the request to the server
        blog.delete('admin/category/locale', {
            _id: value._category,
            locale: value._locale
        }).then(data => {
            if (data) {
                onDeleted(value._locale);
            }
        }, error => {
            events.get('error').trigger(error);
        });
    }
    // Called to update the locale record
    function update() {
        // Get the record from the parent
        const dRecord = refForm.current.value;
        // Send the request to the server
        blog.update('admin/category/locale', {
            _id: value._category,
            locale: value._locale,
            record: dRecord
        }).then(data => {
            if (data) {
                editSet(false);
                onUpdated(dRecord);
            }
        }, error => {
            if (error.code === errors.body.DATA_FIELDS) {
                refForm.current.error(pathToTree(error.msg).record);
            }
            else if (error.code === errors.body.DB_DUPLICATE) {
                refForm.current.error({
                    slug: _.duplicate
                });
            }
            else if (error.code === errors.body.DB_UPDATE_FAILED) {
                return;
            }
            else {
                events.get('error').trigger(error);
            }
        });
    }
    // Render
    return edit ? (React.createElement(React.Fragment, null,
        React.createElement(Typography, null,
            React.createElement("b", null, afindo(locales, '_id', value._locale).name)),
        React.createElement(DefineParent, { name: value._locale, node: tree, ref: refForm, type: "update", value: value }),
        React.createElement(Box, { className: "actions" },
            React.createElement(Button, { color: "secondary", onClick: () => editSet(false), variant: "contained" }, _.cancel),
            React.createElement(Button, { color: "primary", onClick: update, variant: "contained" }, _.locale.update)))) : (React.createElement(Paper, { className: "blog_categories_record_view" },
        React.createElement(Box, { className: "view_left" },
            locales.length > 1 &&
                React.createElement(Typography, null,
                    React.createElement("span", { className: "nobr" },
                        React.createElement("b", null, _.label.language))),
            React.createElement(Typography, null,
                React.createElement("span", { className: "nobr" }, _.label.slug)),
            React.createElement(Typography, null,
                React.createElement("span", { className: "nobr" }, _.label.title)),
            React.createElement(Typography, null,
                React.createElement("span", { className: "nobr" }, _.label.description))),
        React.createElement(Box, { className: "view_center" },
            locales.length > 1 &&
                React.createElement(Typography, null,
                    React.createElement("b", null, afindo(locales, '_id', value._locale).name)),
            React.createElement(Typography, null,
                baseURL,
                "/c/",
                value.slug,
                React.createElement("br", null)),
            React.createElement(Typography, null,
                value.title,
                React.createElement("br", null)),
            React.createElement(Typography, null, value.description)),
        rights.update &&
            React.createElement(Box, { className: "view_right" },
                React.createElement("i", { className: 'fa-solid fa-edit' + (edit ? ' open' : ''), onClick: () => editSet(b => !b) }),
                React.createElement("br", null),
                count > 1 &&
                    React.createElement(ConfirmDelete, { onConfirm: remove }))));
}
// Valid props
LocaleViewEdit.propTypes = {
    baseURL: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    locales: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDeleted: PropTypes.func.isRequired,
    onUpdated: PropTypes.func.isRequired,
    rights: PropTypes.object.isRequired,
    tree: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired
};
