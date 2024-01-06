/**
 * Media View
 *
 * Popup dialog for uploading new media
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-06
 */
import PropTypes from 'prop-types';
import React from 'react';
import type { rightsStruct } from '@ouroboros/brain-react';
import type { MediaStruct } from '../../composites/MediaFilter';
export type ViewProps = {
    onClose: () => void;
    onThumbAdded: (size: string, data: any) => void;
    onThumbRemoved: (size: string) => void;
    rights: rightsStruct;
    value: MediaStruct;
};
/**
 * Media View
 *
 * Handles uploading new media
 *
 * @name View
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function View({ onClose, onThumbAdded, onThumbRemoved, value }: ViewProps): React.JSX.Element;
declare namespace View {
    var propTypes: {
        onClose: PropTypes.Validator<(...args: any[]) => any>;
        onThumbAdded: PropTypes.Validator<(...args: any[]) => any>;
        onThumbRemoved: PropTypes.Validator<(...args: any[]) => any>;
        rights: PropTypes.Validator<Required<PropTypes.InferProps<{
            create: PropTypes.Requireable<boolean>;
            delete: PropTypes.Requireable<boolean>;
            read: PropTypes.Requireable<boolean>;
            update: PropTypes.Requireable<boolean>;
        }>>>;
        value: PropTypes.Validator<object>;
    };
}
export default View;
