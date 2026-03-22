/**
 * Category Add
 *
 * Popup dialog for creating a new category
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-11
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { Tree } from '@ouroboros/define';
import type { LocaleStruct } from '../../../types';
import type { CategoryStruct } from '.';
export type CategoryAddProps = {
    locales: LocaleStruct[] | false;
    onAdded: (val: CategoryStruct) => void;
    onCancel: () => void;
    open: boolean;
    tree: Tree;
};
/**
 * Category Add
 *
 * Handles the form for a single locale associated with a category
 *
 * @name Add
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Add({ locales, onAdded, onCancel, open, tree }: CategoryAddProps): React.JSX.Element;
declare namespace Add {
    var propTypes: {
        locales: PropTypes.Validator<(object | null | undefined)[]>;
        onAdded: PropTypes.Validator<(...args: any[]) => any>;
        onCancel: PropTypes.Validator<(...args: any[]) => any>;
        open: PropTypes.Validator<boolean>;
        tree: PropTypes.Validator<object>;
    };
}
export default Add;
