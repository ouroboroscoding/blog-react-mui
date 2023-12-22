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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';

// Project components
import MediaFilter from '../composites/MediaFilter';

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
						toolbar: 'undo redo | ' +
									'blocks | ' +
									'bold italic | ' +
									'alignleft aligncenter alignright alignjustify | ' +
									'bullist numlist outdent indent | ' +
									'link image | ' +
									'removeformat code'
					}}
				/>
				{this.state.select !== false &&
					<Dialog
						fullScreen={this.props.fullScreen}
						fullWidth={true}
						id="blog_post_media_select"
						maxWidth="lg"
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
							<br />
							{(this.state.images === false &&
								<DialogContentText>...</DialogContentText>
							) || (this.state.images.length === 0 &&
								<DialogContentText>{_.no_records}</DialogContentText>
							) ||
								<Box className="blog_post_media_select_records">
									{this.state.images.map(o =>
										<Paper
											className="blog_post_media_select_record"
											key={o._id}
										>
											<Box
												className="blog_post_media_select_record_image"
												style={{backgroundImage: `url(${o.urls.source})`}}
											/>
											<Box className="blog_post_media_select_record_urls">
												<Button
													color={o.urls.source === this.state.select[1] ? 'info' : 'primary'}
													onClick={() => this.setUrl(o.urls.source)}
													variant="contained"
												>{_.source}</Button><br />
												{o.image.thumbnails.map(s =>
													<React.Fragment key={s}>
														<Button
															color={o.urls[s] === this.state.select[1] ? 'info' : 'primary'}
															onClick={() => this.setUrl(o.urls[s])}
															variant="contained"
														>{s[0] === 'f' ? _.fit : _.crop} {s.substring(1)}</Button><br />
													</React.Fragment>
												)}
											</Box>
										</Paper>
									)}
								</Box>
							}
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