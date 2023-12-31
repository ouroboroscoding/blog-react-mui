/**
 * Media Filter
 *
 * Handles selecting the timeline or filename to fetch media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-03
 */
// Ouroboros modules
import blog from '@ouroboros/blog';
import { increment, iso, timestamp } from '@ouroboros/dates';
import safeLocalStorage from '@ouroboros/browser/safeLocalStorage';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
import { compare, empty } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React from 'react';
// Material UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
// Project modules
import Translation from '../../translations';
/**
 * Media Filter
 *
 * Handles UI to filter media
 *
 * @name MediaFilter
 * @access public
 * @extends React.Component
 */
export default class MediaFilter extends React.Component {
    // Member variables
    filenameTimer;
    lastFilter;
    // Props variables
    static propTypes = {
        imagesOnly: PropTypes.bool,
        onRecords: PropTypes.func.isRequired
    };
    static defaultProps = {
        imagesOnly: false
    };
    // Constructor
    constructor(props) {
        // Call the parent
        super(props);
        // Get the stored filter
        const dFilter = safeLocalStorage.json('blog_media_filter', {
            filename: null,
            range: 'today'
        });
        // Calculate the state
        const oState = {
            filename: false, range: false, toggle: []
        };
        if (dFilter.filename) {
            oState.filename = dFilter.filename;
            oState.toggle.push('file');
        }
        if (dFilter.range) {
            oState.range = dFilter.range;
            oState.toggle.push('date');
        }
        if (dFilter.mine) {
            oState.toggle.push('mine');
        }
        // Init the state
        this.state = oState;
        // Keep track of the last filter sent
        this.lastFilter = {};
        // Send it
        this.send();
        // Keep track of filename timer
        this.filenameTimer = null;
        // Bind functions for events
        this.filenameChanged = this.filenameChanged.bind(this);
        this.rangeChanged = this.rangeChanged.bind(this);
        this.toggleChanged = this.toggleChanged.bind(this);
    }
    // Date changed
    dateChanged(which, value) {
        // Copy the existing range
        const lRange = clone(this.state.range);
        // If the "from" changed
        if (which === 'from') {
            // If it's older than the current "to", set it to that
            if (value > lRange[1]) {
                value = lRange[1];
            }
            // Set the new state
            lRange[0] = value;
        }
        // Else, if the "to" changed
        else if (which === 'to') {
            // If it's younger than the current "from", set it to that
            if (value < lRange[0]) {
                value = lRange[0];
            }
            // Set the new state
            lRange[1] = value;
        }
        // Set the state
        this.setState({ range: lRange }, () => this.send());
    }
    // Filename changed
    filenameChanged(ev) {
        // Set the state
        this.setState({
            filename: ev.currentTarget.value
        });
        // If we have an existing timer, stop it
        if (this.filenameTimer !== null) {
            clearTimeout(this.filenameTimer);
        }
        // Set a new timer
        setTimeout(() => this.send(), 1000);
    }
    // Range changed
    rangeChanged(ev) {
        // The new state
        let mRange = null;
        // If it's explicit
        if (ev.target.value === 'explicit') {
            const sToday = iso(new Date(), false);
            mRange = [sToday, sToday];
        }
        // Else, it's a text representation
        else {
            mRange = ev.target.value;
        }
        // Set the new state
        this.setState({ range: mRange }, () => this.send());
    }
    // Togle changed
    toggleChanged(ev, list) {
        // New state
        const oState = clone(this.state);
        // If we had the date and it's removed
        if (this.state.toggle.includes('date') && !list.includes('date')) {
            oState.range = false;
        }
        // Else, if we did not have the date, and now we do
        else if (!this.state.toggle.includes('date') && list.includes('date')) {
            oState.range = 'today';
        }
        // If we had the filename and it's removed
        if (this.state.toggle.includes('file') && !list.includes('file')) {
            oState.filename = false;
        }
        // Else, if we did not have the file, and now we do
        else if (!this.state.toggle.includes('file') && list.includes('file')) {
            oState.filename = '';
        }
        // Set the new toggle
        oState.toggle = list;
        // Set the state, then send the changes
        this.setState(oState, () => this.send());
    }
    // Called to send the data to the parent
    send() {
        // Init the storage
        const dStorage = {};
        // Init the server filter
        const dFilter = {};
        // If we have a filename
        if (this.state.filename !== false) {
            // If the filename isn't empty
            if (this.state.filename.trim() !== '') {
                // Get it
                const sFilename = this.state.filename.trim();
                // Add it to the filter
                dFilter.filename = sFilename;
                // Add it to the storage
                dStorage.filename = sFilename;
            }
        }
        // If we have a range other than 'all'
        if (this.state.range !== false) {
            // If the range is an array
            if (Array.isArray(this.state.range)) {
                dFilter.range = this.state.range;
            }
            // Else, it's some sort of text representation
            else {
                // If it's today
                if (this.state.range === 'today') {
                    const sToday = iso(new Date(), false);
                    dFilter.range = [sToday, sToday];
                }
                // If it's the last 7 days
                else if (this.state.range === 'last_week') {
                    dFilter.range = [
                        iso(increment(-7), false), iso(new Date(), false)
                    ];
                }
                // If it's the last 14 days
                else if (this.state.range === 'last_two_weeks') {
                    dFilter.range = [
                        iso(increment(-14), false), iso(new Date(), false)
                    ];
                }
                // If it's the last 30 days
                else if (this.state.range === 'last_thirty') {
                    dFilter.range = [
                        iso(increment(-30), false), iso(new Date(), false)
                    ];
                }
                // If it's the last 90 days
                else if (this.state.range === 'last_ninety') {
                    dFilter.range = [
                        iso(increment(-90), false), iso(new Date(), false)
                    ];
                }
                // If it's the last 365 days
                else if (this.state.range === 'last_year') {
                    dFilter.range = [
                        iso(increment(-365), false), iso(new Date(), false)
                    ];
                }
                // If it's just in this month
                else if (this.state.range === 'this_month') {
                    const oNow = new Date();
                    const iMonth = oNow.getMonth();
                    const sMonth = iMonth < 10 ? `0${iMonth}` : iMonth.toString();
                    dFilter.range = [
                        `${oNow.getFullYear()}-${sMonth}-01`,
                        iso(oNow, false)
                    ];
                }
                // If it's just in this year
                else if (this.state.range === 'this_year') {
                    const oNow = new Date();
                    dFilter.range = [
                        `${oNow.getFullYear()}-01-01`,
                        iso(oNow, false)
                    ];
                }
            }
            // Add it to the storage
            dStorage.range = this.state.range;
        }
        // If we only want the user's uploads
        if (this.state.toggle.includes('mine')) {
            // Add it to the filter
            dFilter.mine = true;
            // Add it to the storage
            dStorage.mine = true;
        }
        // If the filter has changed
        if (!compare(dFilter, this.lastFilter)) {
            // Overwrite the last filter
            this.lastFilter = dFilter;
            // If it's empty, clear the records
            if (empty(dFilter)) {
                this.props.onRecords([]);
                return;
            }
            // Else, fetch the records from the server, start by cloning the
            //	filter
            const dData = dFilter;
            // If we have a range, convert it
            if (dData.range) {
                dData.range[0] = timestamp(dData.range[0] + ' 00:00:00', false);
                dData.range[1] = timestamp(dData.range[1] + ' 23:59:59', false);
            }
            // If we only want images
            if (this.props.imagesOnly) {
                dData.images_only = true;
            }
            // Fetch from the server
            this.props.onRecords(false);
            blog.read('admin/media/filter', dData).then(this.props.onRecords, error => events.get('error').trigger(error));
            // Store it
            localStorage.setItem('blog_media_filter', JSON.stringify(dStorage));
        }
    }
    // Render
    render() {
        // Text
        const _ = Translation.get().media_filter;
        // Actual render
        return (React.createElement(Box, { id: "blog_media_filter" },
            React.createElement(Box, { className: "blog_media_filter_toggle" },
                React.createElement(ToggleButtonGroup, { onChange: this.toggleChanged, value: this.state.toggle },
                    React.createElement(ToggleButton, { value: "date", "aria-label": "date" },
                        React.createElement("i", { className: "fa-solid fa-calendar-days" })),
                    React.createElement(ToggleButton, { value: "file", "aria-label": "file" },
                        React.createElement("i", { className: "fa-solid fa-file" })),
                    React.createElement(ToggleButton, { value: "mine", "aria-label": "mine" },
                        React.createElement("i", { className: "fa-solid fa-user" })))),
            React.createElement(Grid, { className: "blog_media_filter_fields", container: true, spacing: 0 },
                this.state.toggle.includes('date') &&
                    React.createElement(Grid, { item: true, xs: 12, md: 6, lg: 4, xl: 3 },
                        React.createElement(Select, { native: true, onChange: this.rangeChanged, size: "small", value: Array.isArray(this.state.range) ?
                                'explicit' :
                                this.state.range },
                            React.createElement("option", { value: "today" }, _.range.today),
                            React.createElement("option", { value: "last_week" }, _.range.last_week),
                            React.createElement("option", { value: "last_two_weeks" }, _.range.last_two_weeks),
                            React.createElement("option", { value: "last_thirty" }, _.range.last_thirty),
                            React.createElement("option", { value: "last_ninety" }, _.range.last_ninety),
                            React.createElement("option", { value: "last_year" }, _.range.last_year),
                            React.createElement("option", { value: "this_month" }, _.range.this_month),
                            React.createElement("option", { value: "this_year" }, _.range.this_year),
                            React.createElement("option", { value: "explicit" }, _.range.explicit)),
                        Array.isArray(this.state.range) &&
                            React.createElement(Box, { className: "blog_media_filter_explicit" },
                                React.createElement(TextField, { className: "blog_media_filter_date", label: _.from, onChange: (ev) => this.dateChanged('from', ev.currentTarget.value), placeholder: _.from, size: "small", type: "date", value: this.state.range[0] }),
                                React.createElement(TextField, { className: "blog_media_filter_date", label: _.to, onChange: (ev) => this.dateChanged('to', ev.currentTarget.value), placeholder: _.to, size: "small", type: "date", value: this.state.range[1] }))),
                this.state.toggle.includes('file') &&
                    React.createElement(Grid, { item: true, xs: 12, md: 6, lg: 4, xl: 3 },
                        React.createElement(TextField, { className: "blog_media_filter_filename", label: _.filename, onChange: this.filenameChanged, placeholder: _.filename, size: "small", type: "text", value: this.state.filename })),
                this.state.toggle.includes('mine') &&
                    React.createElement(Grid, { item: true, xs: 12, md: 6, lg: 4, xl: 3 },
                        React.createElement(Typography, null, _.whose.mine)))));
    }
}
