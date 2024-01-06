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
import { pathToTree } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
// Project modules
import Translation from '../../../../translations';
// Local modules
import { define_titleToSlug } from '../../../../functions/titleToSlug';
/**
 * Category Locale View/Edit
 *
 * Handles viewing and editing of a single category locale
 *
 * @name LocaleAdd
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function LocaleAdd({ category, locales, onAdded, onCancel, tree }) {
    // Text
    const _ = Translation.get().categories;
    // State
    const [loc, locSet] = useState(locales[0]._id);
    // Refs
    const refForm = useRef(null);
    // Called to create the new locale record
    function submit() {
        // Get the record from the parent
        const dRecord = refForm.current.value;
        // Send the request to the server
        blog.create('admin/category/locale', {
            _id: category,
            locale: loc,
            record: dRecord
        }).then(data => {
            if (data) {
                onAdded(loc, dRecord);
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
            else {
                events.get('error').trigger(error);
            }
        });
    }
    // Render
    return (React.createElement(Paper, { className: "blog_category_record_locale" },
        React.createElement(Box, { className: "blog_category_record_locale_header" },
            React.createElement(Box, { className: "blog_category_record_locale_select" },
                React.createElement(FormControl, null,
                    React.createElement(InputLabel, { id: "category_locale_select_add" }, _.label.language),
                    React.createElement(Select, { label: _.label.language, labelId: "category_locale_select_add", native: true, onChange: ev => locSet(ev.target.value), size: "small", value: loc }, locales.map(o => React.createElement("option", { key: o._id, value: o._id }, o.name)))))),
        React.createElement("br", null),
        React.createElement(DefineParent, { name: "category_locale_add", node: tree, onNodeChange: {
                title: define_titleToSlug
            }, ref: refForm, type: "create" }),
        React.createElement(Box, { className: "actions" },
            React.createElement(Button, { color: "secondary", onClick: onCancel, variant: "contained" }, _.cancel),
            React.createElement(Button, { color: "primary", onClick: submit, variant: "contained" }, _.locale.add))));
}
// Valid props
LocaleAdd.propTypes = {
    category: PropTypes.string.isRequired,
    locales: PropTypes.arrayOf(PropTypes.object).isRequired,
    onAdded: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    tree: PropTypes.object.isRequired
};
