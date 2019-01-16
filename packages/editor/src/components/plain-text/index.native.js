/**
 * External dependencies
 */
import RCTAztecView from 'react-native-aztec';
import { TextInput, Platform } from 'react-native';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';

export default class PlainText extends Component {
	constructor() {
		super( ...arguments );
		this.isIOS = Platform.OS === 'ios';
		this.onContentSizeChange = this.onContentSizeChange.bind( this );
	}

	componentDidMount() {
		// if isSelected is true, we should request the focus on this TextInput
		if ( ( this._input.isFocused() === false ) && ( this._input.props.isSelected === true ) ) {
			this.focus();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( ! this.props.isSelected && prevProps.isSelected && this.isIOS ) {
			this._input.blur();
		}
	}

	focus() {
		this._input.focus();
	}

	/**
	 * Handles any case where the content of the AztecRN instance has changed in size
	 */

	onContentSizeChange( contentSize ) {
		if ( ! this.props.onContentSizeChange ) return;
		const contentHeight = contentSize.height;
		this.forceUpdate(); // force re-render the component skipping shouldComponentUpdate() See: https://reactjs.org/docs/react-component.html#forceupdate
		this.props.onContentSizeChange( {
			aztecHeight: contentHeight,
		}
		);
	}

	render() {
		//console.log(styles[ 'editor-plain-text' ]);
		const {
			tagName,
			style,
			value,
		} = this.props;

		// Save back to HTML from React tree
		const html = '<' + tagName + '>' + value + '</' + tagName + '>';
		return (
			<RCTAztecView
				{ ...this.props }
				text={ { text: html } }
				ref={ ( x ) => this._input = x }
				className={ [ styles[ 'editor-plain-text' ], this.props.className ] }
				onChange={ ( event ) => {
					return;
					this.props.onChange( event.nativeEvent.text );
				} }
				color={ 'black' }
				style={ style }
				onContentSizeChange={ this.onContentSizeChange }
				onFocus={ this.props.onFocus } // always assign onFocus as a props
				onBlur={ this.props.onBlur } // always assign onBlur as a props
			/>
		);
	}
}
