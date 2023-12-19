/**
 * Category Title
 *
 * A single function to handle displaying a category's title using the current
 * locale
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-13
 */

/**
 * Category Title
 *
 * @name categoryTitle
 * @access public
 * @param {string} locale The currently selected locale
 * @param {object} category The category to find a title for
 * @returns an appropriate title for the category
 */
export default function categoryTitle(locale, category) {
	if(locale in category.locales) {
			return category.locales[locale].title;
	} else {
		const sLocale = Object.keys(category.locales)[0];
		return category.locales[sLocale].title;
	}
}