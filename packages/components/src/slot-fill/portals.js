/**
 * External dependencies
 */
import { identity } from 'lodash';

/**
 * WordPress dependencies
 */
import { createPortal, Fragment } from '@wordpress/element';

/*
* The following wrappers are not necessary on the web implementation,
* but are required to enable portals on React Native.
*/

export { createPortal };

export const SlotContent = Fragment;

export const withPortalProvider = identity;
