/**
 * HTML
 *
 * Used for WYSIWYG editor
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2022-04-26
 */
import PropTypes from 'prop-types';
import React from 'react';
export type HTMLProps = {
    error: string | false;
    value: string;
};
type HTMLState = {
    callback: ((value: string, meta?: Record<string, any> | undefined) => void) | null;
    current: string | false;
};
/**
 * HTML
 *
 * Handles writing WYSIWYG HTML content
 *
 * @name HTML
 * @access public
 * @extends React.Component
 */
export default class HTML extends React.Component<HTMLProps, HTMLState> {
    private refEditor;
    static propTypes: {
        error: PropTypes.Requireable<NonNullable<string | boolean | null | undefined>>;
        value: PropTypes.Requireable<string>;
    };
    static defaultProps: {
        error: boolean;
        value: string;
    };
    constructor(props: HTMLProps);
    setUrl(url: string): void;
    render(): React.JSX.Element;
    get value(): string;
    set value(value: string);
}
export {};
