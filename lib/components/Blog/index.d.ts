/**
 * Blog
 *
 * Primary entry into blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */
import PropTypes from 'prop-types';
import React from 'react';
import '../../sass/blog.scss';
import type { MetaKey } from '../composites/Meta';
export type BlogProps = {
    allowedMeta: MetaKey[];
    basePath: string;
    baseURL: string;
    locale: string;
};
/**
 * Blog
 *
 * Handles mapping of routers in types path
 *
 * @name Blog
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Blog({ allowedMeta, basePath, baseURL, locale }: BlogProps): React.JSX.Element | null;
declare namespace Blog {
    var propTypes: {
        allowedMeta: PropTypes.Requireable<(string | null | undefined)[]>;
        basePath: PropTypes.Requireable<string>;
        baseURL: PropTypes.Requireable<string>;
        locale: PropTypes.Requireable<string>;
    };
    var defaultProps: {
        allowedMeta: string[];
        basePath: string;
        baseURL: string;
        locale: string;
    };
}
export default Blog;
