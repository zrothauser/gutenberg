/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { getOffsetParent } from '@wordpress/dom';

/**
 * Returns a style object for applying as `position: absolute` for an element
 * relative to the bottom-center of the current selection. Includes `top` and
 * `left` style properties.
 *
 * @return {Object} Style object.
 */
function getSelectionRects() {
	const selection = window.getSelection();

	// Unlikely, but in the case there is no selection, return empty styles so
	// as to avoid a thrown error by `Selection#getRangeAt` on invalid index.
	if ( selection.rangeCount === 0 ) {
		return [];
	}

	const range = selection.getRangeAt( 0 );
	const rects = range.getClientRects();

	return map( rects, ( rect ) => {
		// Get position relative viewport.
		let { top, left } = rect;
		const { width, height } = rect;

		// Offset by positioned parent, if one exists.
		const offsetParent = getOffsetParent( selection.anchorNode );
		if ( offsetParent ) {
			const parentRect = offsetParent.getBoundingClientRect();
			top -= parentRect.top;
			left -= parentRect.left;
		}

		return { top, left, width, height };
	} );
}

/**
 * Component which renders itself positioned under the current caret selection.
 * The position is calculated at the time of the component being mounted, so it
 * should only be mounted after the desired selection has been made.
 *
 * @type {WPComponent}
 */
class SelectionOverlay extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			rects: getSelectionRects(),
		};
	}

	render() {
		const { rects } = this.state;

		const selectionOverlays = map( rects, ( rect, index ) => (
			<div className="editor-format-toolbar__link-selection" style={ rect } key={ index } />
		) );

		return (
			<Fragment>
				{ selectionOverlays }
			</Fragment>
		);
	}
}

export default SelectionOverlay;
