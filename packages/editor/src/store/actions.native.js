
/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data-controls';

export * from './actions.js';

export function* receiveEntityRecords( kind, name, records, query, invalidateCache = false ) {
	yield dispatch( 'core', 'receiveEntityRecords', kind, name, records, query, invalidateCache );
}

export function* addEntities( entities ) {
	yield dispatch( 'core', 'addEntities', entities );
}

/**
 * Returns an action object that enables or disables post title selection.
 *
 * @param {boolean} [isSelected=true] Whether post title is currently selected.
 *
 * @return {Object} Action object.
 */
export function togglePostTitleSelection( isSelected = true ) {
	return {
		type: 'TOGGLE_POST_TITLE_SELECTION',
		isSelected,
	};
}
