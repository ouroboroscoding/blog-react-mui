/**
 * HTML
 *
 * Used for WYSIWYG editor
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2022-04-26
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';

// Project components
import MediaFilter from './MediaFilter';

// Text
import TEXT from '../../translations/media_select';

/**
 * HTML
 *
 * Handles writing WYSIWYG HTML content
 *
 * @name HTML
 * @access public
 * @extends React.Component
 */
export default class HTML extends React.Component {

	// Constructor
	constructor(props) {

		// Call the parent
		super(props);

		// Init state
		this.state = {
			images: false,
			select: false
		}

		// Refs
		this.refEditor = React.createRef();

		// Bind methods
		this.setUrl = this.setUrl.bind(this);
	}

	// Called to set the URL for an image
	setUrl(url) {
		this.state.select[0](url);
		this.setState({ select: false });
	}

	// Render
	render() {
		const _ = TEXT[this.props.locale];

		return (
			<Box id="blog_post_html">
				<Editor
					apiKey={process.env.REACT_APP_TINYMCE}
					onInit={(evt, editor) => this.refEditor.current = editor}
					initialValue={this.props.value}
					init={{
						block_formats: 'Heading 1=h1; Heading 2=h2; Heading 3=h3; Paragraph=p; Preformatted=pre',
						content_style: 'body { font-family: "Roboto","Helvetica","Arial",sans-serif; font-size: 1rem }',
						file_picker_callback: (callback, value, meta) => {
							this.setState({ select: [ callback, value ] });
						},
						height: '100%',
						image_advtab: true,
						image_caption: true,
						menubar: false,
						plugins: ['advlist', 'emoticons', 'link', 'lists', 'code', 'image'],
						paste_as_text: true,
						statusbar: false,
						style_formats: [ {
							title: 'Image Left',
							selector: 'img',
							styles: {
								float: 'left',
								margin: '0 10px 0 10px'
							}
						}, {
							title: 'Image Right',
							selector: 'img',
							styles: {
								float: 'right',
								margin: '0 10px 0 10px'
							}
						} ],
						toolbar: 'undo redo | ' +
									'blocks + styles | ' +
									'bold italic | ' +
									'alignleft aligncenter alignright alignjustify | ' +
									'bullist numlist outdent indent | ' +
									'subscript superscript | ' +
									'link | emoticons | image | ' +
									'removeformat | code'
					}}
				/>
				{this.state.select !== false &&
					<Dialog
						fullScreen={this.props.fullScreen}
						fullWidth={true}
						id="blog_post_media_select"
						onClose={() => this.setState({ select: false })}
						open={true}
					>
						<DialogTitle>{_.title}</DialogTitle>
						<DialogContent>
							<MediaFilter
								imagesOnly={true}
								locale={this.props.locale}
								onError={this.props.onError}
								onRecords={records => this.setState({ images: records })}
							/>
							{(this.state.images === false &&
								<DialogContentText>...</DialogContentText>
							) || (this.state.images.length === 0 &&
								<DialogContentText>{_.no_records}</DialogContentText>
							) || (this.state.images.map(o =>
								<Paper
									className="blog_post_media_select_record"
									key={o._id}
								>
									<Box className="blog_post_media_select_record_image">
										<img src={o.urls['source']} alt="" />
									</Box>
									<Box className="blog_post_media_select_record_urls">
										<Button
											color="primary"
											onClick={() => this.setUrl(o.urls['source'])}
											variant="contained"
										>{_.source}</Button>
										{o.image.thumbnails.map(s =>
											<Button
												color="primary"
												key={s}
												onClick={() => this.setUrl(o.urls[s])}
												variant="contained"
											>{s}</Button>
										)}
									</Box>
								</Paper>
							))}
						</DialogContent>
					</Dialog>
				}
			</Box>
		);
	}

	get value() {
		return this.refEditor.current.getContent();
	}

	set value(value) {
		this.refEditor.current.setContent(value);
	}
}

// Valid props
HTML.propTypes = {
	error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	locale: PropTypes.string.isRequired,
	fullScreen: PropTypes.bool,
	value: PropTypes.string
}

// Default props
HTML.defaultProps = {
	error: false,
	fullScreen: false,
	value: ''
}