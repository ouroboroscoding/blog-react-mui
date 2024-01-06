/**
 * Media Filter
 *
 * Handles selecting the timeline or filename to fetch media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-03
 */
import PropTypes from 'prop-types';
import React from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
export type MediaStruct = {
    _id?: string;
    _created?: number;
    _hover?: boolean;
    uploader: string;
    filename: string;
    mime: string;
    length: number;
    image?: MediaImageStruct;
    urls: Record<string, string>;
};
export type MediaImageStruct = {
    resolution: {
        width: number;
        height: number;
    };
    thumbnails: string[];
};
export type MediaFilterProps = {
    imagesOnly: boolean;
    onRecords: (val: MediaStruct[] | false) => void;
};
type MediaFilterState = {
    filename: string | false;
    range: string | string[] | false;
    toggle: string[];
};
/**
 * Media Filter
 *
 * Handles UI to filter media
 *
 * @name MediaFilter
 * @access public
 * @extends React.Component
 */
export default class MediaFilter extends React.Component<MediaFilterProps, MediaFilterState> {
    private filenameTimer;
    private lastFilter;
    static propTypes: {
        imagesOnly: PropTypes.Requireable<boolean>;
        onRecords: PropTypes.Validator<(...args: any[]) => any>;
    };
    static defaultProps: {
        imagesOnly: boolean;
    };
    constructor(props: MediaFilterProps);
    dateChanged(which: 'from' | 'to', value: string): void;
    filenameChanged(ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void;
    rangeChanged(ev: SelectChangeEvent<string | false>): void;
    toggleChanged(ev: any, list: string[]): void;
    send(): void;
    render(): React.JSX.Element;
}
export {};
