/**
 * Category
 *
 * Handles displaying a single category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { rightsStruct } from '@ouroboros/brain-react';
import type { Tree } from '@ouroboros/define';
import type { CategoryStruct } from '..';
import type { LocaleStruct } from '../../../../types';
export type CategoryProps = {
    baseURL: string;
    locales: LocaleStruct[];
    onDelete: () => void;
    onUpdated: (data: CategoryStruct) => void;
    rights: rightsStruct;
    tree: Tree;
    value: CategoryStruct;
};
/**
 * Category
 *
 * Handles displaying and editing a single category
 *
 * @name Category
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Category({ baseURL, locales, onDelete, onUpdated, rights, tree, value }: CategoryProps): React.JSX.Element;
declare namespace Category {
    var propTypes: {
        baseURL: PropTypes.Validator<string>;
        locales: PropTypes.Validator<(object | null | undefined)[]>;
        onDelete: PropTypes.Validator<(...args: any[]) => any>;
        onUpdated: PropTypes.Validator<(...args: any[]) => any>;
        rights: PropTypes.Validator<object>;
        tree: PropTypes.Validator<object>;
        value: PropTypes.Validator<object>;
    };
}
export default Category;
