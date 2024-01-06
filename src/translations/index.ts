/**
 * Translations
 *
 * Handles fetching existing translations and adding new ones
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2024-01-05
 */

// Types
import { TranslationStruct } from './type';

// Import the existing translations
import enCA from './en-CA.json';
import enUS from './en-US.json';
import frCA from './fr-CA.json';

// Hold all the current translations
const _list: Record<string, TranslationStruct> = {
	'en-CA': enCA,
	'en-US': enUS,
	'fr-CA': frCA
}

// Locale regex
const _validLocale = /^[a-z]{2}-[A-Z]{2}$/

// Holds the current locale
let _locale: string = 'en-US';

// Types

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
export function addTable(locale: string, translation: TranslationStruct): void {

	// If the locale is not valid
	if(!_validLocale.test(locale)) {
		throw new Error(`${locale} is not a valid locale, must be in the format aa-AA, where the first two letters represent the language, and the last two represent the country`)
	}

	// Else, add the translation under the locale
	_list[locale] = translation;
}

/**
 * Get Table
 *
 * Returns the currently set translation table
 *
 * @name getTable
 * @access public
 * @returns TranslationStruct
 */
function getTable(): TranslationStruct {
	return _list[_locale];
}

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
function setLocale(locale: string): void {

	// If the locale is not valid
	if(!_validLocale.test(locale)) {
		throw new Error(`${locale} is not a valid locale, must be in the format aa-AA, where the first two letters represent the language, and the last two represent the country`)
	}

	// If the translation doesn't exist
	if(!(locale in _list)) {
		throw new Error(`${locale} is not found in the translation table. Use addTranslation prior to using the Blog components if you want to add a new locale`);
	}

	// Set the locale
	_locale = locale;
}

// Create the "instance"
const Translation = {
	add: addTable,
	get: getTable,
	locale: (): string => {
		return _locale;
	},
	set: setLocale
}

// Export it
export default Translation;