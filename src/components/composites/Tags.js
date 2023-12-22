/**
 * Tags
 *
 * Handles setting tags for a post
 *
 * @author Bast Nasr <bast@undoo.com>
 * @created 2023-12-20
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

/**
 * Tags
 *
 * Handles the form for setting prices per carton
 *
 * @name Tags
 * @access public
 * @extends NodeBase
 */
export default class Tags extends React.Component {

	// Constructor
	constructor(props) {

		// Call the parent
		super(props);

		// Set initial state
		this.state = {
			value: props.value
		}

		// Refs
		this.refText = React.createRef();

		// Bind methods
		this.keyPressed = this.keyPressed.bind(this);
		this.tagRemove = this.tagRemove.bind(this);
	}

	// Called to set the error message
	error(msg) {
		this.setState({ error: msg });
	}

	// Called to check keys for anything that would trigger a new tag
	keyPressed(ev) {

		// If we got an Enter or a comma
		if(ev.key === 'Enter' || ev.key === ',') {

			// Cancel the key press
			ev.preventDefault();
			ev.cancelBubble = true;

			// Get the initial value
			let sTag = this.refText.current.value;

			// If it ends in a ','
			if(sTag.slice(-1) === ',') {
				sTag = sTag.substring(0, sTag.length - 1);
			}

			// Trim any remaining space and convert it to lowercase, then
			//	normalize it
			sTag = sTag.trim().toLowerCase();

			// If the tag doesn't already exist and it's not empty
			if(this.state.value.indexOf(sTag) === -1 && sTag !== '') {

				// Set the new state
				this.setState({
					error: false,
					value: [...this.state.value, sTag]
				});
			}

			// Clear the text
			this.refText.current.value = '';
		}

		// Else, it we got a backspace
		else if(ev.key === 'Backspace') {

			// If there's no text to remove, and we have some tags
			if(this.refText.current.value === '' && this.state.value.length) {

				// Remove the last tag and set it to the text
				this.refText.current.value = this.state.value.pop();

				// Remove the last tag
				this.setState({
					error: false,
					value: [ ...this.state.value ]
				});
			}
		}

		// Else, if we have 32 characters
		else if(this.refText.current.value.length === 32) {

			// Trim any remaining space and convert it to lowercase, then
			//	normalize it
			const sTag = this.refText.current.value.trim().toLowerCase();

			// If the tag doesn't already exist and it's not empty
			if(this.state.value.indexOf(sTag) === -1 && sTag !== '') {

				// Set the new state
				this.setState({
					error: false,
					value: [...this.state.value, sTag]
				});
			}

			// Clear the text
			this.refText.current.value = '';
		}
	}

	// Render
	render() {
		return (
			<TextField
				error={this.state.error ? true : false}
				helperText={this.state.error || ''}
				inputRef={this.refText}
				label="Tags"
				onKeyUp={this.keyPressed}
				placeholder="Tags"
				variant="outlined"
				InputProps={{
					startAdornment: (
						<Box className="node_tags_adornment">
							{this.state.value.map(tag =>
								<Box key={tag} className="node_tags_tag">
									<nobr>
										<Typography variant="span">{tag}</Typography>
										<IconButton onClick={() => this.tagRemove(tag)}>
											<i className="fa-solid fa-circle-xmark" />
										</IconButton>
									</nobr>
								</Box>
							)}
						</Box>
					)
				}}
			/>
		);
	}

	// Called to remove a tag
	tagRemove(name) {

		// Filter out the tag and set the new state
		this.setState({
			error: false,
			value: this.state.value.filter(val => val !== name)
		});
	}

	// Get value
	get value() {
		return this.state.value;
	}

	// Set value
	set value(val) {
		this.setState({ value: val });
	}
}

// Valid props
Tags.propTypes = {
	value: PropTypes.arrayOf(PropTypes.string).isRequired
}

// Default props
Tags.defaultProps = {
	value: []
}