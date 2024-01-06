/**
 * Translations
 *
 * Handles fetching existing translations and adding new ones
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-05
 */
import { TranslationStruct } from './type';
/**
 * Add Table
 *
 * Adds a new translation table for a specific locale
 *
 * @name addTranslation
 * @access public
 * @param locale The locale to add the translation for
 * @param translation The translation table to add to the locale
 * @throws throws an error if the locale is not formatted properly
 * @returns void
 */
export declare function addTable(locale: string, translation: TranslationStruct): void;
/**
 * Get Table
 *
 * Returns the currently set translation table
 *
 * @name getTable
 * @access public
 * @returns TranslationStruct
 */
declare function getTable(): TranslationStruct;
/**
 * Set Locale
 *
 * Sets the locale to be used
 *
 * @name setLocale
 * @access public
 * @param locale The locale to set for future translations
 * @returns void
 */
declare function setLocale(locale: string): void;
declare const Translation: {
    add: typeof addTable;
    get: typeof getTable;
    locale: () => string;
    set: typeof setLocale;
};
export default Translation;
