/**
 * Title to Slug
 *
 * A single function to handle converting a title into a url slug
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-15
 */
import { ParentChangeEvent } from '@ouroboros/define-mui';
/**
 * Define Title To Slug
 *
 * Converts a title string into a URL slug and returns it as an object with one
 * key suitable for an onNodeChange event
 *
 * @name define_titleToSlug
 * @access public
 * @param ev The event sent from the Form/Parent
 * @returns object
 */
export declare function define_titleToSlug(ev: ParentChangeEvent): Record<string, any>;
/**
 * Title To Slug
 *
 * Converts a str into a URL slug and returns it as a new string
 *
 * @name titleToSlug
 * @access public
 * @param title The title to convert
 * @returns string
 */
export default function titleToSlug(title: string): string;
