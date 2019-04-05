/**
 * External dependencies
 */
import insertTextAtCursor from 'insert-text-at-cursor';

/**
 * WordPress dependencies
 */
import {
	Toolbar,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	Component,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockControls, PlainText } from '@wordpress/block-editor';

class CodeEdit extends Component {
	layoutControls() {
		return [
			{
				icon: 'arrow-right-alt',
				title: __( 'Indent current line' ),
				onClick: () => this.indentCode(),
			},
		];
	}

	indentCode() {
		const el = this.textarea;
		insertTextAtCursor( el, '\t' );
	}

	render() {
		const {
			attributes,
			className,
			setAttributes,
		} = this.props;

		return (
			<div className={ className }>
				<BlockControls>
					<Toolbar controls={ this.layoutControls() } />
				</BlockControls>
				<PlainText
					value={ attributes.content }
					onChange={ ( content ) => {
						setAttributes( { content } );
					} }
					placeholder={ __( 'Write code…' ) }
					aria-label={ __( 'Code' ) }
					innerRef={ ( ref ) => this.textarea = ref }
				/>
			</div>
		);
	}
}

export default CodeEdit;
