/**
 * Upload
 *
 * Handles a single file to be uploaded
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-02-16
 */
import PropTypes from 'prop-types';
import React, { DragEvent } from 'react';
export type UploadProps = {
    accept?: string;
    element: (props: ElementProps) => JSX.Element;
    maxFileSize?: number;
    onChange: (val: UploadedStruct) => void;
    value?: any;
};
export type UploadedFileStruct = {
    dimensions?: {
        height: number;
        width: number;
    };
} & File;
export type UploadedStruct = {
    file: UploadedFileStruct;
    url: string;
};
type DragStruct = {
    onDrop: (ev: DragEvent<HTMLDivElement>) => void;
    onDragEnter: (ev: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (ev: DragEvent<HTMLDivElement>) => void;
    onDragOver: (ev: DragEvent<HTMLDivElement>) => void;
    onDragStart: (ev: DragEvent<HTMLDivElement>) => void;
};
export type ElementProps = {
    file: any;
    click: () => void;
    drag: DragStruct;
};
/**
 * Upload
 *
 * Manages a single uploaded file
 *
 * @name Upload
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Upload(props: UploadProps): React.JSX.Element;
declare namespace Upload {
    var propTypes: {
        accept: PropTypes.Requireable<string>;
        maxFileSize: PropTypes.Requireable<number>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        value: PropTypes.Requireable<PropTypes.InferProps<{
            url: PropTypes.Requireable<string>;
        }>>;
    };
    var defaultProps: {
        accept: string;
    };
}
export default Upload;
