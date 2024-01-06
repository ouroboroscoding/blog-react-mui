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

// Project modules
import Translation from '../translations';

// Types
interface HasTitle { title: string }
interface HasLocales { locales: Record<string, HasTitle> }

/**
 * Locale Title
 *
 * @name localeTitle
 * @access public
 * @param {object} record The record to find a title for
 * @returns an appropriate title for the record
 */
export default function localeTitle(record: HasLocales) {

	// Get the current locale
	const locale = Translation.locale();

	// If it exists, use that title
	if(locale in record.locales) {
		return record.locales[locale].title;
	}

	// Else, just grab the title from the first locale we have
	else {
		const sLocale = Object.keys(record.locales)[0];
		return record.locales[sLocale].title;
	}
}