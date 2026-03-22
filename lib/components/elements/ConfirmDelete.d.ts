/**
 * Confirm Delete
 *
 * Handles confirmation of clicking on a delete icon
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */
import PropTypes from 'prop-types';
import React from 'react';
export type ConfirmDeleteProps = {
    onConfirm: () => void;
};
/**
 * Confirm Delete
 *
 * @name View
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function ConfirmDelete({ onConfirm }: ConfirmDeleteProps): React.JSX.Element;
declare namespace ConfirmDelete {
    var propTypes: {
        onConfirm: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default ConfirmDelete;
