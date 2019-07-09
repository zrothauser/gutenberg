/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
// import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RichText from '../rich-text';

export function unkeyBy( obj, keyField ) {
	return Object.keys( obj ).flatMap( ( key ) =>
		obj[ key ].map( ( value ) => ( { [ keyField ]: key, ...value } ) )
	);
	// return map( obj, ( v, k ) => ( { [ key ]: k, ...v } ) );
}

export default function Footnotes() {
	const { notes } = useSelect( ( select ) => ( {
		notes: select( 'core/block-editor' ).getFootnotes(),
	} ) );

	// const [ notes, setNotes ] = useState( [ {
	// 	id: '1234',
	// 	isSelected: false,
	// } ] );

	// { /* This needs to become a slot/fill */ }
	// { notes.length > 0 &&

	return (
		<>
			<h2><small>Notes</small></h2>
			<style
				dangerouslySetInnerHTML={ {
					__html: `
body {
counter-reset: footnotes;
}

.editor-styles-wrapper a.note-anchor {
counter-increment: footnotes;
}

.note-anchor:after {
margin-left: 2px;
content: '[' counter( footnotes ) ']';
vertical-align: super;
font-size: smaller;
}
`,
				} }
			/>
			{ unkeyBy( notes, 'clientId' ).map( ( { id: noteId, content, isSelected }, index ) => {
				return <ol
					key={ noteId }
					start={ index + 1 }
					className={ classnames( 'note-list', {
						'is-selected': isSelected,
					} ) }
				>
					<li id={ noteId }>
						<a
							href={ `#${ noteId }-anchor` }
							aria-label={ __( 'Back to content' ) }
							onClick={ () => {
								// This is a hack to get the target to focus.
								// The attribute will later be removed when selection is set.
								document.getElementById( `${ noteId }-anchor` ).contentEditable = 'false';
							} }
						>
							↑
						</a>
						{ ' ' }
						<RichText.Content tagName="span" value={ content } />
						{ ' ' }
						{ /*<input
							aria-label={ __( 'Note' ) }
							value={ this.state.noteValues[ id ] }
							onChange={ ( event ) => {
								this.setState( { noteValues: {
									...this.state.noteValues,
									[ id ]: event.target.value,
								} } );
							} }
							placeholder={ __( 'Note' ) }
						/> */ }
					</li>
				</ol>;
			} ) }
		</>
	);
}
