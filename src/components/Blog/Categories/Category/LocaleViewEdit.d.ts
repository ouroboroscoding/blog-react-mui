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
import type { rightsStruct } from '@ouroboros/brain-react';
import type { Tree } from '@ouroboros/define';
import type { CategoryLocaleStruct } from '..';
import type { LocaleStruct } from '../../../../types';
export type LocaleViewEditProps = {
    baseURL: string;
    count: number;
    locales: LocaleStruct[];
    onDeleted: (val: string) => void;
    onUpdated: (val: CategoryLocaleStruct) => void;
    rights: rightsStruct;
    tree: Tree;
    value: CategoryLocaleStruct;
};
/**
 * Category Locale View/Edit
 *
 * Handles viewing and editing of a single category locale
 *
 * @name LocaleViewEdit
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function LocaleViewEdit({ baseURL, count, locales, onDeleted, onUpdated, rights, tree, value }: LocaleViewEditProps): React.JSX.Element;
declare namespace LocaleViewEdit {
    var propTypes: {
        baseURL: PropTypes.Validator<string>;
        count: PropTypes.Validator<number>;
        locales: PropTypes.Validator<(object | null | undefined)[]>;
        onDeleted: PropTypes.Validator<(...args: any[]) => any>;
        onUpdated: PropTypes.Validator<(...args: any[]) => any>;
        rights: PropTypes.Validator<object>;
        tree: PropTypes.Validator<object>;
        value: PropTypes.Validator<object>;
    };
}
export default LocaleViewEdit;
