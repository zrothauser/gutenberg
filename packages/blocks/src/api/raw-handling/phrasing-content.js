/**
 * External dependencies
 */
import { omit, without } from 'lodash';

/**
 * All text-level semantic elements.
 */
const phrasingContentSchema = {
	// https://html.spec.whatwg.org/multipage/text-level-semantics.html
	a: { attributes: [ 'href', 'target', 'rel' ] },
	em: {},
	strong: {},
	small: {},
	s: {},
	// cite: {},
	q: { attributes: [ 'cite' ] },
	dfn: { attributes: [ 'title' ] },
	// abbr: { attributes: [ 'title' ] }, Not visible.
	// data: { attributes: [ 'value' ] }, Not visible.
	// time: { attributes: [ 'datetime' ] }, Not visible.
	code: {},
	var: {},
	samp: {},
	kbd: {},
	sub: {},
	sup: {},
	// i: {},
	// b: {},
	// u: {}, Used for misspelling. Shouldn't be copied over.
	mark: {},
	// bdi: { attributes: [ 'dir' ] }, Not visible.
	// bdo: { attributes: [ 'dir' ] }, Not visible.
	br: {},
	// wbr: {}, Not visible.
	// https://html.spec.whatwg.org/multipage/edits.html
	ins: {
		// We shouldn't copy potentially sensitive information which is not
		// visible to the user.
		// attributes: [ 'cite', 'datetime' ],
	},
	del: {
		// We shouldn't copy potentially sensitive information which is not
		// visible to the user.
		// attributes: [ 'cite', 'datetime' ],
	},
	// Text elements.
	'#text': {},
};

// Recursion is needed.
// Possible: strong > em > strong.
// Impossible: strong > strong.
without( Object.keys( phrasingContentSchema ), '#text', 'br' ).forEach( ( tag ) => {
	phrasingContentSchema[ tag ].children = omit( phrasingContentSchema, tag );
} );

// Add ruby: rt and rp can only be contained by ruby.
const rubyContentSchema = {
	...phrasingContentSchema,
	ruby: {},
	rt: { children: { ...phrasingContentSchema } },
	rp: { children: { ...phrasingContentSchema } },
};

rubyContentSchema.ruby.children = rubyContentSchema;
phrasingContentSchema.ruby = {
	children: rubyContentSchema,
};

/**
 * Get schema of possible paths for phrasing content.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
 *
 * @return {Object} Schema.
 */
export function getPhrasingContentSchema() {
	return phrasingContentSchema;
}

/**
 * Find out whether or not the given node is phrasing content.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content
 *
 * @param {Element} node The node to test.
 *
 * @return {boolean} True if phrasing content, false if not.
 */
export function isPhrasingContent( node ) {
	const tag = node.nodeName.toLowerCase();
	return rubyContentSchema.hasOwnProperty( tag ) || tag === 'span';
}
