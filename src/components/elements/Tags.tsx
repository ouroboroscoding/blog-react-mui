/**
 * Tags
 *
 * Handles setting tags for a post
 *
 * @author Bast Nasr <bast@undoo.com>
 * @created 2023-12-20
 */

// Ouroboros modules
import { empty } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { KeyboardEvent } from 'react';

// Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

// Types
export type TagsProps = {
	error: string | false,
	label?: string,
	onChange?: (val: string[]) => void,
	placeholder?: string,
	value: string[]
}
type TagsState = {
	error: string | false,
	value: string[]
}

/**
 * Tags
 *
 * Handles the form for setting prices per carton
 *
 * @name Tags
 * @access public
 * @extends NodeBase
 */
export default class Tags extends React.Component<TagsProps, TagsState> {

	// Member variables
	private refText: React.RefObject<any>;

	// Props types
	static propTypes = {
		error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
		label: PropTypes.string,
		onChange: PropTypes.func,
		placeholder: PropTypes.string,
		value: PropTypes.arrayOf(PropTypes.string).isRequired
	}
	static defaultProps = {
		error: false,
		value: []
	}

	// Constructor
	constructor(props: TagsProps) {

		// Call the parent
		super(props);

		// Set initial state
		this.state = {
			error: props.error,
			value: props.value
		}

		// Refs
		this.refText = React.createRef();

		// Bind methods
		this.keyUp = this.keyUp.bind(this);
		this.tagRemove = this.tagRemove.bind(this);
	}

	// Called when props passed to the component have changed
	componentDidUpdate(prevProps: TagsProps) {

		// Init the new state
		const oState: Record<string, any> = {};

		// If the error changed
		if(prevProps.error !== this.props.error) {
			oState.error = this.props.error;
		}

		// If the value changed
		if(prevProps.value !== this.props.value) {
			oState.value = this.props.value;
		}

		// If we have changes, set the new state
		if(!empty(oState)) {
			this.setState(oState as TagsState);
		}
	}

	// Called to set the error message
	error(msg: string) {
		this.setState({ error: msg });
	}

	// Called to check keys for anything that would trigger a new tag
	keyUp(ev: KeyboardEvent) {

		// If we got an Enter or a comma
		if(ev.key === 'Enter' || ev.key === ',') {

			// Cancel the key press
			ev.preventDefault();

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
				}, () => {
					if(this.props.onChange) {
						this.props.onChange(this.state.value);
					}
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
				}, () => {
					if(this.props.onChange) {
						this.props.onChange(this.state.value);
					}
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
				}, () => {
					if(this.props.onChange) {
						this.props.onChange(this.state.value);
					}
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
				label={this.props.label}
				onKeyUp={this.keyUp}
				placeholder={this.props.placeholder}
				variant="outlined"
				InputProps={{
					startAdornment: (
						<Box className="node_tags_adornment">
							{this.state.value.map(tag =>
								<Box key={tag} className="node_tags_tag">
									<span>{tag}</span>
									<IconButton onClick={() => this.tagRemove(tag)}>
										<i className="fa-solid fa-circle-xmark" />
									</IconButton>
								</Box>
							)}
						</Box>
					)
				}}
			/>
		);
	}

	// Called to remove a tag
	tagRemove(name: string) {

		// Filter out the tag and set the new state
		this.setState({
			error: false,
			value: this.state.value.filter(val => val !== name)
		}, () => {
			if(this.props.onChange) {
				this.props.onChange(this.state.value);
			}
		});
	}

	// Get value
	get value(): string[] {
		return this.state.value;
	}

	// Set value
	set value(val: string[]) {
		this.setState({ value: val });
	}
}