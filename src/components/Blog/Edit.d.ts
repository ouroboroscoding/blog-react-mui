/**
 * Edit Post
 *
 * Holds the component for updated or adding to an existing post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-23
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { MetaKey } from '../composites/Meta';
export type EditProps = {
    _id: string;
    allowedMeta: MetaKey[];
    baseURL: string;
};
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
declare function Edit({ _id, allowedMeta, baseURL }: EditProps): React.JSX.Element;
declare namespace Edit {
    var propTypes: {
        _id: PropTypes.Validator<string>;
        allowedMeta: PropTypes.Validator<(string | null | undefined)[]>;
        baseURL: PropTypes.Validator<string>;
    };
}
export default Edit;
