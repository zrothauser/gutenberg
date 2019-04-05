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
	constructor( props ) {
		super( props );
		const {
			attributes,
		} = props;
		this.state = {
			content: attributes.content,
		};
		this.layoutControls = [
			{
				icon: 'arrow-right-alt',
				title: __( 'Indent code' ),
				onClick: () => this.indentCode(),
			},
			{
				icon: 'arrow-left-alt',
				title: __( 'Unindent code' ),
				onClick: () => this.unIndentCode(),
			},
		];
	}

	getIndentation( content ) {
		const lines = content.split( '\n' );
		return lines.reduce( ( line, indent ) => {
			if ( line.startsWith( '\t' ) ) {
				indent = 'tab';
			}
			if ( line.startsWith( ' ' ) ) {
				indent = 'space';
			}
			return indent;
		} );
	}

	indentCode() {
		const identation = this.getIndentation( this.state.content );
		const splitContent = this.state.content.split( '\n' );
		const newContent = splitContent.map( ( line ) => {
			if ( identation === 'tab' ) {
				return `\t${ line }`;
			}
			if ( identation === 'space' ) {
				return `  ${ line }`;
			}
			return line;
		} ).join( '\n' );

		this.setState( {
			content: newContent,
		} );
	}

	unIndentCode() {
		const identation = this.getIndentation( this.state.content );
		const splitContent = this.state.content.split( '\n' );
		const newContent = splitContent.map( ( line ) => {
			if ( identation === 'tab' ) {
				return `${ line }`.replace( '\t', '' );
			}
			if ( identation === 'space' ) {
				return line.replace( '  ', '' );
			}
			return line;
		} ).join( '\n' );

		this.setState( {
			content: newContent,
		} );
	}

	render() {
		const {
			className,
		} = this.props;

		return (
			<div className={ className }>
				<BlockControls>
					<Toolbar controls={ this.layoutControls } />
				</BlockControls>
				<PlainText
					value={ this.state.content }
					onChange={ ( content ) => {
						this.setState( { content } );
					} }
					placeholder={ __( 'Write code…' ) }
					aria-label={ __( 'Code' ) }
				/>
			</div>
		);
	}
}

export default CodeEdit;
