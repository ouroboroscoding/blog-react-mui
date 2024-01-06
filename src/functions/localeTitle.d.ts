/**
 * Locale Title
 *
 * A single function to handle displaying an object's title using the current
 * locale
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */
interface HasTitle {
    title: string;
}
interface HasLocales {
    locales: Record<string, HasTitle>;
}
/**
 * Locale Title
 *
 * @name localeTitle
 * @access public
 * @param {object} record The record to find a title for
 * @returns an appropriate title for the record
 */
export default function localeTitle(record: HasLocales): string;
export {};
