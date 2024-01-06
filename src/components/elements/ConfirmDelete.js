/**
 * Confirm Delete
 *
 * Handles confirmation of clicking on a delete icon
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */
// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
/**
 * Confirm Delete
 *
 * @name View
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function ConfirmDelete({ onConfirm }) {
    // State
    const [state, stateSet] = useState(false);
    // Timer reference
    const refTimer = useRef(null);
    // Called when clicked on
    function click() {
        if (!state) {
            stateSet(true);
            refTimer.current = window.setTimeout(() => stateSet(false), 3000);
        }
        else {
            stateSet(false);
            onConfirm();
            if (refTimer.current !== null) {
                window.clearTimeout(refTimer.current);
                refTimer.current = null;
            }
        }
    }
    // Render
    return (React.createElement("i", { className: 'fa-solid fa-trash-alt' + (state ? ' confirm' : ''), onClick: click }));
}
// Valid props
ConfirmDelete.propTypes = {
    onConfirm: PropTypes.func.isRequired
};
