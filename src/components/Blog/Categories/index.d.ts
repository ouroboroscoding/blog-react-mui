/**
 * Categories
 *
 * Primary entry into categories component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-11
 */
import PropTypes from 'prop-types';
import React from 'react';
export type CategoriesProps = {
    baseURL: string;
};
export type CategoryStruct = {
    _id?: string;
    _created?: number;
    locales: Record<string, CategoryLocaleStruct>;
};
export type CategoryLocaleStruct = {
    _id?: string;
    _created?: number;
    _locale?: string;
    _category?: string;
    slug: string;
    title: string;
    description: string;
};
/**
 * Categories
 *
 * Handles fetching and display of media
 *
 * @name Categories
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Categories({ baseURL }: CategoriesProps): React.JSX.Element;
declare namespace Categories {
    var propTypes: {
        baseURL: PropTypes.Validator<string>;
    };
}
export default Categories;
