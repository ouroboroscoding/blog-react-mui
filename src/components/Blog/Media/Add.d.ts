/**
 * Media Add
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { MediaStruct } from '../../composites/MediaFilter';
export type AddProps = {
    onAdded: (val: MediaStruct) => void;
    onCancel: () => void;
    open: boolean;
};
type DimensionStruct = {
    height: number;
    width: number;
};
export type FileStruct = {
    _id?: string;
    data: string;
    dimensions?: DimensionStruct;
    name: string;
    mime: string;
    length: number;
    type: string;
    url: string;
};
/**
 * Media Add
 *
 * Handles uploading new media
 *
 * @name Add
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Add({ onAdded, onCancel, open }: AddProps): React.JSX.Element;
declare namespace Add {
    var propTypes: {
        onAdded: PropTypes.Validator<(...args: any[]) => any>;
        onCancel: PropTypes.Validator<(...args: any[]) => any>;
        open: PropTypes.Validator<boolean>;
    };
}
export default Add;
