/**
 * Meta
 *
 * Handles setting meta tags for a post
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-03
 */
import PropTypes from 'prop-types';
import React from 'react';
export type MetaStruct = {
    description?: string;
    image?: string;
    title?: string;
    url?: string;
};
export type MetaKey = keyof MetaStruct;
export type MetaProps = {
    allowed: MetaKey[];
    errors: MetaStruct;
    onChange: (val: MetaStruct) => void;
    value: MetaStruct;
};
/**
 * Meta
 *
 * Handles UI to filter media
 *
 * @name Meta
 * @access public
 */
declare function Meta({ allowed, errors, onChange, value }: MetaProps): React.JSX.Element;
declare namespace Meta {
    var propTypes: {
        allowed: PropTypes.Validator<(string | null | undefined)[]>;
        errors: PropTypes.Requireable<Required<PropTypes.InferProps<{
            description: PropTypes.Requireable<string>;
            image: PropTypes.Requireable<string>;
            title: PropTypes.Requireable<string>;
            url: PropTypes.Requireable<string>;
        }>>>;
        onChange: PropTypes.Validator<(...args: any[]) => any>;
        value: PropTypes.Requireable<Required<PropTypes.InferProps<{
            description: PropTypes.Requireable<string>;
            image: PropTypes.Requireable<string>;
            title: PropTypes.Requireable<string>;
            url: PropTypes.Requireable<string>;
        }>>>;
    };
    var defaultProps: {
        errors: {};
        value: {};
    };
}
export default Meta;
