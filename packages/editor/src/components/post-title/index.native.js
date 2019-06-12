/**
 * External dependencies
 */
import { View } from 'react-native';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { decodeEntities } from '@wordpress/html-entities';
import { withDispatch } from '@wordpress/data';
import { withFocusOutside } from '@wordpress/components';
import { withInstanceId, compose } from '@wordpress/compose';
import { __, sprintf } from '@wordpress/i18n';
import { getDefaultBlockName, createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import styles from './style.scss';

class PostTitle extends Component {
	constructor() {
		super( ...arguments );

		this.onSelect = this.onSelect.bind( this );
		this.onUnselect = this.onUnselect.bind( this );
		this.onReplace = this.onReplace.bind( this );
		this.titleViewRef = null;

		this.state = {
			isSelected: false,
		};
	}

	componentDidMount() {
		if ( this.props.innerRef ) {
			this.props.innerRef( this );
		}
	}

	handleFocusOutside() {
		this.onUnselect();
	}

	focus() {
		if ( this.titleViewRef ) {
			this.titleViewRef.focus();
			this.setState( { isSelected: true } );
		}
	}

	onSelect() {
		this.setState( { isSelected: true } );
		this.props.clearSelectedBlock();
	}

	onUnselect() {
		this.setState( { isSelected: false } );
	}

	onReplace( blocks ) {
		if ( ! Array.isArray( blocks ) ) {
			return;
		}
		blocks = this.removeUndefinedBlocks( blocks );
		this.updateTitleFromPastedContent( blocks );

		blocks.shift();

		this.props.insertBlocks( blocks );
	}

	removeUndefinedBlocks( blocks ) {
		return blocks.filter( ( block ) => {
			return block !== undefined;
		});
	}

	updateTitleFromPastedContent( blocks ) {
		if ( blocks.length ) {
			let title = blocks[ 0 ].attributes.content;
			this.props.onUpdate( title );
		}
	}

	render() {
		const {
			placeholder,
			style,
			title,
			focusedBorderColor,
			borderStyle,
		} = this.props;

		const decodedPlaceholder = decodeEntities( placeholder );
		const borderColor = this.state.isSelected ? focusedBorderColor : 'transparent';

		return (
			<View
				style={ [ styles.titleContainer, borderStyle, { borderColor } ] }
				accessible={ ! this.state.isSelected }
				accessibilityLabel={
					isEmpty( title ) ?
						/* translators: accessibility text. empty post title. */
						__( 'Post title. Empty' ) :
						sprintf(
							/* translators: accessibility text. %s: text content of the post title. */
							__( 'Post title. %s' ),
							title
						)
				}
			>
				<RichText
					tagName={ 'p' }
					rootTagsToEliminate={ [ 'strong' ] }
					unstableOnFocus={ this.onSelect }
					onBlur={ this.props.onBlur } // always assign onBlur as a props
					multiline={ false }
					style={ style }
					fontSize={ 24 }
					fontWeight={ 'bold' }
					deleteEnter={ true }
					onChange={ ( value ) => {
						this.props.onUpdate( value );
					} }
					placeholder={ decodedPlaceholder }
					value={ title }
					onSplit={ ( content ) => {
						return createBlock( getDefaultBlockName(), {
							content,
						} );
					 } }
					onEnter={ this.props.onEnterPress }
					onReplace={ this.onReplace }
					disableEditingMenu={ true }
					setRef={ ( ref ) => {
						this.titleViewRef = ref;
					} }
				>
				</RichText>
			</View>
		);
	}
}

const applyWithDispatch = withDispatch( ( dispatch ) => {
	const {
		undo,
		redo,
		insertBlocks,
	} = dispatch( 'core/editor' );

	const {
		insertDefaultBlock,
		clearSelectedBlock,
	} = dispatch( 'core/block-editor' );

	return {
		onEnterPress() {
			insertDefaultBlock( undefined, undefined, 0 );
		},
		insertBlocks( blocks ) {
			insertBlocks( blocks, 0 );
		},
		onUndo: undo,
		onRedo: redo,
		clearSelectedBlock,
	};
} );

export default compose(
	applyWithDispatch,
	withInstanceId,
	withFocusOutside
)( PostTitle );
