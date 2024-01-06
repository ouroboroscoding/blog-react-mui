/**
 * Published
 *
 * Published page of blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-02
 */
import PropTypes from 'prop-types';
import React from 'react';
import '../../sass/blog.scss';
export type PublishedProps = {
    basePath: string;
};
/**
 * Published
 *
 * Handles mapping of routers in types path
 *
 * @name Published
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Published({ basePath }: PublishedProps): React.JSX.Element;
declare namespace Published {
    var propTypes: {
        basePath: PropTypes.Validator<string>;
    };
}
export default Published;
