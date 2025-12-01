/**
 * Tags
 *
 * Handles setting tags for a post
 *
 * @author Bast Nasr <bast@undoo.com>
 * @created 2023-12-20
 */
import PropTypes from 'prop-types';
import React, { KeyboardEvent } from 'react';
export type TagsProps = {
    error: string | false;
    label?: string;
    onChange?: (val: string[]) => void;
    placeholder?: string;
    value: string[];
};
type TagsState = {
    error: string | false;
    value: string[];
};
/**
 * Tags
 *
 * Handles the form for setting prices per carton
 *
 * @name Tags
 * @access public
 * @extends NodeBase
 */
export default class Tags extends React.Component<TagsProps, TagsState> {
    private refText;
    static propTypes: {
        error: PropTypes.Requireable<NonNullable<string | boolean | null | undefined>>;
        label: PropTypes.Requireable<string>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        placeholder: PropTypes.Requireable<string>;
        value: PropTypes.Validator<(string | null | undefined)[]>;
    };
    static defaultProps: {
        error: boolean;
        value: never[];
    };
    constructor(props: TagsProps);
    componentDidUpdate(prevProps: TagsProps): void;
    error(msg: string): void;
    keyUp(ev: KeyboardEvent): void;
    render(): React.JSX.Element;
    tagRemove(name: string): void;
    get value(): string[];
    set value(val: string[]);
}
export {};
