/**
 * Home
 *
 * Home page of blog component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-28
 */
import PropTypes from 'prop-types';
import React from 'react';
import '../../sass/blog.scss';
export type HomeProps = {
    basePath: string;
};
/**
 * Home
 *
 * Handles mapping of routers in types path
 *
 * @name Home
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Home({ basePath }: HomeProps): React.JSX.Element;
declare namespace Home {
    var propTypes: {
        basePath: PropTypes.Validator<string>;
    };
}
export default Home;
