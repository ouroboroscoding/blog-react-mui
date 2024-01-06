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
import { ParentChangeEvent } from '@ouroboros/define-mui'

// Constants
const TITLE_TO_SLUG = /[ a-z0-9-]/;

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
export function define_titleToSlug(ev: ParentChangeEvent): Record<string, any>  {

	// Use the regular function to generate the slug, then return it in a format
	//	define can handle
	return { 'slug': titleToSlug(ev.data.title) }
}

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

export default function titleToSlug(title: string): string {

	// Clean the title of any special characters, then convert it to
	//	lowercase
	const s = normalize(title).toLowerCase();

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
	return l.join('');
}