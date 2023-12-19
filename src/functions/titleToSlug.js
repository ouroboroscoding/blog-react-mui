/**
 * Title to Slug
 *
 * A single function to handle converting a title into a url slug
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-12-15
 */

// Ouroboros modules
import { normalize } from '@ouroboros/tools';

// Constants
const TITLE_TO_SLUG = /[ a-z0-9-]/;

/**
 * Title To Slug
 *
 * Converts a title string into a URL slug and returns it as an object with one
 * key suitable for an onNodeChange event
 *
 * @name titleToSlug
 * @access public
 * @param {Event} ev The event sent from the Form/Parent
 * @returns object
 */

export default function titleToSlug(ev) {

	// Clean the title of any special characters, then convert it to
	//	lowercase
	const s = normalize(ev.data.title).toLowerCase();

	// Init the return string array
	const l = [];

	// Go through each character in the title
	for(const c of s.split('')) {

		// If it's a space, replace it with a dash -
		if(c === ' ') {
			l.push('-');
		}

		// Else, if it's any valid uri character,
		else if(TITLE_TO_SLUG.test(c)) {
			l.push(c);
		}
	}

	// Join the array and return it as the new URL
	return { 'slug': l.join('') }
}