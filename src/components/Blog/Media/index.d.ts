/**
 * Media
 *
 * Primary entry into media component
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-02
 */
import React from 'react';
export type ThumbStruct = {
    key?: string;
    type: 'f' | 'c';
    height: number;
    chain: boolean;
    width: number;
};
/**
 * Media
 *
 * Handles fetching and display of media
 *
 * @name Media
 * @access public
 * @returns React.Component
 */
export default function Media(): React.JSX.Element;
