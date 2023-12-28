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

/**
 * Locale Title
 *
 * @name localeTitle
 * @access public
 * @param {string} locale The currently selected locale
 * @param {object} record The record to find a title for
 * @returns an appropriate title for the record
 */
export default function localeTitle(locale, record) {
	if(locale in record.locales) {
			return record.locales[locale].title;
	} else {
		const sLocale = Object.keys(record.locales)[0];
		return record.locales[sLocale].title;
	}
}