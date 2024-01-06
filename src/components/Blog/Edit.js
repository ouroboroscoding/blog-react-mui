/**
 * Edit Post
 *
 * Holds the component for updated or adding to an existing post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-23
 */
// Ouroboros modules
import blog, { errors } from '@ouroboros/blog';
import { useRights } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import { timestamp } from '@ouroboros/dates';
import events from '@ouroboros/events';
import { locales as Locales } from '@ouroboros/mouth-mui';
import { afindo, arrayFindDelete, compare, empty, isObject, omap, pathToTree } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
// Material UI
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
// Project components
import HTML from '../elements/HTML';
import Meta from '../composites/Meta';
import Tags from '../elements/Tags';
// Project modules
import localeTitle from '../../functions/localeTitle';
import titleToSlug from '../../functions/titleToSlug';
import Translation from '../../translations';
/**
 * Edit
 *
 * Handles the Edit component for updated a blog post
 *
 * @name Edit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Edit({ _id, allowedMeta, baseURL }) {
    // Text
    const _ = Translation.get().edit;
    // State
    const [cats, catsSet] = useState(false);
    const [error, errorSet] = useState({});
    const [loc, locSet] = useState(false);
    const [locales, localesSet] = useState(false);
    const [menu, menuSet] = useState(false);
    const [newLang, newLangSet] = useState(null);
    const [original, originalSet] = useState(false);
    const [post, postSet] = useState(false);
    const [remaining, remainingSet] = useState([]);
    // Hooks
    const fullScreen = useMediaQuery('(max-width:600px)');
    const rightsPost = useRights('blog_post');
    const rightsPublish = useRights('blog_publish');
    // Refs
    const refHtml = useRef(null);
    const refTags = useRef(null);
    // Locale and categories effect
    useEffect(() => {
        // Fetch categories
        blog.read('admin/category').then(catsSet, err => {
            events.get('error').trigger(err);
        });
        // Subscribe to locales
        const oL = Locales.subscribe(l => {
            if (empty(l))
                return;
            localesSet(l);
        });
        // Unsubscribe
        return () => {
            oL.unsubscribe();
        };
    }, []);
    // ID effect
    useEffect(() => {
        // Fetch the post from the server
        blog.read('admin/post', { _id }).then(data => {
            // If we have data and at least one locale
            if (data && !empty(data.locales)) {
                locSet(Object.keys(data.locales)[0]);
                originalSet(clone(data));
                postSet(data);
            }
            else {
                events.get('error').trigger('Missing locales');
            }
        }, err => events.get('error').trigger(err));
    }, [_id]);
    // Calculate remaining locales
    useEffect(() => {
        // If either is false, do nothing
        if (locales === false || post === false) {
            return;
        }
        // Init remaining
        const lRemaining = [];
        // Go through all locales
        for (const o of locales) {
            // If we don't have it
            if (!(o._id in post.locales)) {
                lRemaining.push(o);
            }
        }
        // Set new remaining
        remainingSet(lRemaining);
    }, [locales, post]);
    // Called when a category is changed
    function catChange(id, checked) {
        // If we are adding the category
        if (checked) {
            postSet(o => {
                const i = o.categories.indexOf(id);
                if (i === -1) {
                    const oPost = clone(o);
                    oPost.categories.push(id);
                    return oPost;
                }
                else {
                    return o;
                }
            });
        }
        // Else, if we are removing the category
        else {
            postSet(o => {
                const i = o.categories.indexOf(_id);
                if (i > -1) {
                    const oPost = clone(o);
                    oPost.categories.splice(i, 1);
                    return oPost;
                }
                else {
                    return o;
                }
            });
        }
    }
    // Called when a specific value in a locale has been changed
    function dataChange(_locale, which, value) {
        postSet(o => {
            const oData = clone(o);
            oData.locales[_locale][which] = value;
            return oData;
        });
    }
    // Called to see if an error exists
    function errorExists(_locale, which) {
        return 'locales' in error &&
            _locale in error.locales &&
            which in error.locales[_locale];
    }
    // Called to get the error message
    function errorMsg(_locale, which) {
        // Check for a message in the specific locale
        let mMsg = ('locales' in error &&
            _locale in error.locales &&
            which in error.locales[_locale]) ?
            error.locales[_locale][which] :
            false;
        // If we have a message, translate it
        if (mMsg !== false) {
            if (isObject(mMsg)) {
                for (const k of Object.keys(mMsg)) {
                    mMsg[k] = _.errors[mMsg[k]];
                }
            }
            else {
                mMsg = _.errors[mMsg];
            }
        }
        // Return the result
        return mMsg;
    }
    // Called to add a new locale to the post
    function localeAdd() {
        // Store the new locale
        const sLocale = newLang.locale;
        // Update the post using the latest data
        postSet(o => {
            const oPost = clone(o);
            oPost.locales[sLocale] = {
                title: newLang.title,
                slug: newLang.slug,
                tags: newLang.tags,
                content: refHtml.current.value
            };
            return oPost;
        });
        // Remove the locale used from the remaining
        remainingSet(l => arrayFindDelete(l, '_id', sLocale, true));
        // Clear the new lang content
        newLangSet(null);
        // Set the new selected locale
        locSet(sLocale);
    }
    // Called when the location changes
    function locChanged(value, expanded) {
        // If we're not expanding, or already on that locale, do nothing
        if (!expanded || value === loc) {
            return;
        }
        // If we're clicking on new
        if (value === 'new') {
            // Do we have values?
            if (!newLang.locale) {
                // Init the new object using the first available locale
                const oLang = {
                    content: '',
                    locale: remaining[0]._id,
                    title: '',
                    slug: '',
                    tags: [],
                    meta: {}
                };
                // Set the new language data
                newLangSet(oLang);
            }
        }
        // If the old locale was new
        if (loc === 'new') {
            newLangSet(o => {
                const oLang = clone(o);
                oLang.content = refHtml.current.value;
                return oLang;
            });
        }
        // Else, make sure we update the content in the post
        else {
            postSet(o => {
                const oData = clone(o);
                oData.locales[loc].content = refHtml.current.value;
                return oData;
            });
        }
        // Set the new loc
        locSet(value);
    }
    // Called when a specific value in a new locale has been changed
    function newChange(which, value) {
        newLangSet(o => {
            const oData = clone(o);
            oData[which] = value;
            if (which === 'title') {
                oData.slug = titleToSlug(value);
            }
            return oData;
        });
    }
    // Called to publish the changes
    function publish() {
        // Send the request to the server
        blog.update('admin/post/publish', { _id }).then(data => {
            if (data) {
                events.get('success').trigger(_.publish.success);
                const i = timestamp();
                postSet(o => {
                    const oPost = clone(o);
                    oPost._updated = i;
                    oPost.last_published = i;
                    originalSet(oPost);
                    return oPost;
                });
            }
        }, err => {
            events.get('error').trigger(err);
        });
    }
    // Called to submit changes
    function submit() {
        // Clear errors
        errorSet({});
        // Copy the post data
        const oData = clone(post);
        // If we're not on new
        if (loc !== 'new') {
            // Update the current content in the post
            oData.locales[loc].content = refHtml.current.value;
        }
        // If nothing has changed from the original
        if (compare(oData, original)) {
            events.get('success').trigger(_.no_changes);
            return;
        }
        // Send the request to the server
        blog.update('admin/post', oData).then(data => {
            if (data) {
                oData._updated = timestamp();
                postSet(oData);
                originalSet(oData);
                events.get('success').trigger(_.saved);
            }
        }, err => {
            if (err.code === errors.body.DATA_FIELDS) {
                const dErrors = pathToTree(err.msg);
                errorSet(dErrors);
                events.get('success').trigger(_.error_saving);
            }
            else {
                events.get('error').trigger(err);
            }
        });
    }
    // If we don't have the post, the categories, or the locales
    if (!post || !loc || !locales || !cats) {
        return (React.createElement(Box, { id: "blog_post_edit" },
            React.createElement(Typography, null, "...")));
    }
    // Render
    return (React.createElement(Box, { id: "blog_post_edit" },
        React.createElement(Box, { className: "blog_post_edit_content" },
            React.createElement(HTML, { error: 'content' in error ? error.content : false, ref: refHtml, value: loc === 'new' ? newLang.content : post.locales[loc].content })),
        fullScreen &&
            React.createElement(Box, { className: 'blog_post_edit_drawer_icon' + (menu ? ' drawer_open' : '') },
                React.createElement(IconButton, { onClick: () => menuSet(b => !b) },
                    React.createElement("i", { className: "fa-solid fa-bars" }))),
        React.createElement(Box, { className: 'blog_post_edit_drawer' + (menu ? ' drawer_open' : '') },
            (rightsPublish.update && post._updated > post.last_published) &&
                React.createElement(Box, { className: "blog_post_edit_drawer_publish" },
                    React.createElement(Button, { color: "primary", onClick: publish, variant: "contained" }, _.publish.button)),
            React.createElement(Box, { className: "blog_post_edit_drawer_fields" },
                React.createElement(Box, { className: "field" },
                    React.createElement(Box, { className: "field_group" },
                        React.createElement(Typography, { className: "legend" }, _.labels.categories),
                        cats.map(o => React.createElement(Box, { className: "category", key: o._id },
                            React.createElement(FormControlLabel, { control: React.createElement(Switch, { checked: post.categories.includes(o._id), onChange: ev => catChange(o._id, ev.target.checked) }), label: localeTitle(o) }))))),
                React.createElement(Box, { className: "blog_post_edit_locales" },
                    omap(post.locales, (v, k) => React.createElement(Accordion, { className: k === loc ? 'accordion_expanded' : '', expanded: k === loc, key: k, onChange: (ev, expanded) => locChanged(k, expanded) },
                        React.createElement(AccordionSummary, null, afindo(locales, '_id', k).name),
                        React.createElement(AccordionDetails, null,
                            React.createElement(Box, { className: "field" },
                                React.createElement(TextField, { error: errorExists(k, 'title'), helperText: errorMsg(k, 'title'), InputLabelProps: {
                                        shrink: true,
                                    }, label: _.labels.title, onChange: ev => dataChange(k, 'title', ev.currentTarget.value), placeholder: _.placeholders.title, size: fullScreen ? 'small' : 'medium', value: post.locales[k].title })),
                            React.createElement(Box, { className: "field" },
                                React.createElement(TextField, { error: errorExists(k, 'slug'), helperText: errorMsg(k, 'slug'), InputProps: {
                                        startAdornment: React.createElement(InputAdornment, { position: "start" }, `${baseURL}/p/`)
                                    }, label: _.labels.slug, onChange: ev => dataChange(k, 'slug', ev.currentTarget.value), size: fullScreen ? 'small' : 'medium', value: post.locales[k].slug })),
                            React.createElement(Box, { className: "field" },
                                React.createElement(Tags, { error: errorMsg(k, 'tags'), label: _.labels.tags, onChange: val => dataChange(k, 'tags', val), placeholder: _.placeholders.tags, ref: refTags, value: post.locales[k].tags })),
                            React.createElement(Meta, { allowed: allowedMeta, errors: errorMsg(k, 'meta') || {}, onChange: val => dataChange(k, 'meta', val), value: post.locales[k].meta || {} })))),
                    remaining.length > 0 &&
                        React.createElement(Accordion, { className: loc === 'new' ? 'accordion_expanded' : '', expanded: loc === 'new', onChange: (ev, expanded) => locChanged('new', expanded) },
                            React.createElement(AccordionSummary, null, _.new_locale),
                            React.createElement(AccordionDetails, null,
                                React.createElement(Box, { className: "field" },
                                    React.createElement(FormControl, { error: '_locale' in error },
                                        React.createElement(InputLabel, { id: "blog_edit_post_locale_select" }, _.labels.language),
                                        React.createElement(Select, { label: _.labels.language, labelId: "blog_edit_post_locale_select", native: true, onChange: ev => newChange('locale', ev.target.value), size: fullScreen ? 'small' : 'medium', value: newLang.locale, variant: "outlined" }, remaining.map(o => React.createElement("option", { key: o._id, value: o._id }, o.name))),
                                        '_locale' in error &&
                                            React.createElement(FormHelperText, null, error._locale))),
                                React.createElement(Box, { className: "field" },
                                    React.createElement(TextField, { error: 'title' in error, helperText: error.title || '', InputLabelProps: {
                                            shrink: true,
                                        }, label: _.labels.title, onChange: ev => newChange('title', ev.currentTarget.value), placeholder: _.placeholders.title, size: fullScreen ? 'small' : 'medium', value: newLang.title })),
                                React.createElement(Box, { className: "field" },
                                    React.createElement(TextField, { error: 'slug' in error, helperText: error.slug || '', InputProps: {
                                            startAdornment: React.createElement(InputAdornment, { position: "start" }, `${baseURL}/p/`)
                                        }, label: _.labels.slug, onChange: ev => newChange('slug', ev.currentTarget.value), size: fullScreen ? 'small' : 'medium', value: newLang.slug })),
                                React.createElement(Box, { className: "field" },
                                    React.createElement(Tags, { error: 'tags' in error ? error.tags : false, label: _.labels.tags, onChange: val => newChange('tags', val), placeholder: _.placeholders.tags, value: newLang.tags })),
                                React.createElement(Box, { className: "actions" },
                                    React.createElement(Button, { color: "primary", onClick: localeAdd, variant: "contained" }, _.new_locale)))))),
            rightsPost.update &&
                React.createElement(Box, { className: "blog_post_edit_drawer_actions" },
                    React.createElement(Button, { color: "primary", onClick: submit, variant: "contained" }, _.submit)))));
}
// Valid props
Edit.propTypes = {
    _id: PropTypes.string.isRequired,
    allowedMeta: PropTypes.arrayOf(PropTypes.string).isRequired,
    baseURL: PropTypes.string.isRequired
};
