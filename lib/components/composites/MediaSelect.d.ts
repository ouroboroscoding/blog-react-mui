/**
 * Media Select
 *
 * Handles selecting the timeline or filename to fetch media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-03
 */
import PropTypes from 'prop-types';
import React from 'react';
export type MediaSelectProps = {
    callback: (val: string) => void;
    current: string;
    onClose: () => void;
};
/**
 * Media Select
 *
 * Handles UI to select media
 *
 * @name MediaSelect
 * @access public
 * @extends React.Component
 */
declare function MediaSelect({ callback, current, onClose }: MediaSelectProps): React.JSX.Element;
declare namespace MediaSelect {
    var propTypes: {
        callback: PropTypes.Validator<(...args: any[]) => any>;
        current: PropTypes.Validator<string>;
        onClose: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default MediaSelect;
