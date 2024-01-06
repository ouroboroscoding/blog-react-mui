/**
 * Category Locale View/Edit
 *
 * Handles displaying a single locale within a category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-15
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { Tree } from '@ouroboros/define';
import type { LocaleStruct } from '../../../../types';
import type { CategoryLocaleStruct } from '..';
export type LocaleAddProps = {
    category: string;
    locales: LocaleStruct[];
    onAdded: (loc: string, data: CategoryLocaleStruct) => void;
    onCancel: () => void;
    tree: Tree;
};
/**
 * Category Locale View/Edit
 *
 * Handles viewing and editing of a single category locale
 *
 * @name LocaleAdd
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function LocaleAdd({ category, locales, onAdded, onCancel, tree }: LocaleAddProps): React.JSX.Element;
declare namespace LocaleAdd {
    var propTypes: {
        category: PropTypes.Validator<string>;
        locales: PropTypes.Validator<(object | null | undefined)[]>;
        onAdded: PropTypes.Validator<(...args: any[]) => any>;
        onCancel: PropTypes.Validator<(...args: any[]) => any>;
        tree: PropTypes.Validator<object>;
    };
}
export default LocaleAdd;
