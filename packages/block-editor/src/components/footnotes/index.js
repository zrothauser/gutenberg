/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function Footnotes() {
	const [ notes, setNotes ] = useState( [ {
		id: '1234',
		isSelected: false,
	} ] );

	// { /* This needs to become a slot/fill */ }
	// { notes.length > 0 &&

	if ( notes.length === 42 ) {
		setNotes();
	}

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
			{ notes.map( ( { id, isSelected }, index ) =>
				<ol
					key={ id }
					start={ index + 1 }
					className={ classnames( 'note-list', {
						'is-selected': isSelected,
					} ) }
				>
					<li id={ id }>
						<a
							href={ `#${ id }-anchor` }
							aria-label={ __( 'Back to content' ) }
							onClick={ () => {
								// This is a hack to get the target to focus.
								// The attribute will later be removed when selection is set.
								document.getElementById( `${ id }-anchor` ).contentEditable = 'false';
							} }
						>
							↑
						</a>
						{ ' ' }
						<input
							aria-label={ __( 'Note' ) }
							value={ this.state.noteValues[ id ] }
							onChange={ ( event ) => {
								this.setState( { noteValues: {
									...this.state.noteValues,
									[ id ]: event.target.value,
								} } );
							} }
							placeholder={ __( 'Note' ) }
						/>
					</li>
				</ol>
			) }
		</>
	);
}
