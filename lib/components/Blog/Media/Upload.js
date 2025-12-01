/**
 * Upload
 *
 * Handles a single file to be uploaded
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-02-16
 */
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
/**
 * Upload
 *
 * Manages a single uploaded file
 *
 * @name Upload
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Upload(props) {
    // State
    const [uploadDragging, uploadDraggingSet] = useState(false);
    // Refs
    const refInput = useRef(null);
    // Called when the file changes
    async function change(files) {
        // If we got no files
        if (!files || files.length === 0) {
            return;
        }
        // Not sure why this is suddenly needed, used to just work by accessing
        //	files[0] in the closure
        const oFile = files[0];
        // Get the file as base64
        const oReader = new FileReader();
        oReader.addEventListener('load', () => {
            // If it's an image
            if (oFile.type.match('image.*')) {
                // Create an image and watch for it to load
                const img = new Image();
                img.addEventListener('load', () => {
                    // Add the dimensions to the file
                    oFile.dimensions = {
                        height: img.height,
                        width: img.width
                    };
                    // Call the on change to notify the parent
                    props.onChange({
                        file: oFile,
                        url: oReader.result
                    });
                });
                // Load the reader result into the image
                img.src = oReader.result;
            }
            // Else if it's any other type of file, just call the on change to
            //	notify the parent
            else {
                props.onChange({
                    file: oFile,
                    url: oReader.result
                });
            }
        });
        oReader.readAsDataURL(oFile);
    }
    // Handle drag events
    function drag(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }
    ;
    // Handle drag in events
    function dragIn(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.dataTransfer && ev.dataTransfer.items && ev.dataTransfer.items.length > 0) {
            uploadDraggingSet(true);
        }
    }
    ;
    // Handle drag out events
    function dragOut(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        uploadDraggingSet(false);
    }
    ;
    // Handle drop
    function drop(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        uploadDraggingSet(false);
        if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
            change(ev.dataTransfer.files);
        }
    }
    // Handle drag start
    function dragStart(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.dataTransfer) {
            ev.dataTransfer.clearData();
        }
    }
    ;
    // Called when the input changes
    function inputChange(ev) {
        change(ev.target.files);
        refInput.current.value = '';
    }
    // Handle upload click
    function uploadClick() {
        refInput.current.click();
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("input", { type: "file", accept: props.accept, ref: refInput, multiple: false, onChange: inputChange, style: { display: 'none' } }),
        props.element({
            file: props.value,
            click: uploadClick,
            drag: {
                onDrop: drop,
                onDragEnter: dragIn,
                onDragLeave: dragOut,
                onDragOver: drag,
                onDragStart: dragStart
            },
            uploadDragging
        })));
}
// Valid props
Upload.propTypes = {
    accept: PropTypes.string,
    maxFileSize: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.shape({
        url: PropTypes.string
    })
};
// Default props
Upload.defaultProps = {
    accept: '*'
};
