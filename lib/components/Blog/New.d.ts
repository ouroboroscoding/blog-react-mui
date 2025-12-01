/**
 * New Post
 *
 * Holds the component for creating a new blog post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-16
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { MetaKey } from '../composites/Meta';
export type NewProps = {
    allowedMeta: MetaKey[];
    basePath: string;
    baseURL: string;
};
/**
 * New
 *
 * Handles the New component for creating a blog post
 *
 * @name New
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function New({ allowedMeta, basePath, baseURL }: NewProps): React.JSX.Element;
declare namespace New {
    var propTypes: {
        allowedMeta: PropTypes.Validator<(string | null | undefined)[]>;
        basePath: PropTypes.Validator<string>;
        baseURL: PropTypes.Validator<string>;
    };
}
export default New;
