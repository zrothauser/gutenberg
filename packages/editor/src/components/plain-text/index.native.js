/**
 * External dependencies
 */
import { TextInput } from 'react-native';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './style.scss';

export default class PlainText extends Component {
	constructor (props) {
		super(props)
		this.state = {
		  // Initial width must be different so React makes the update
		  clutchWidth: '99%'
		}
	}

	componentDidMount() {
		// if isSelected is true, we should request the focus on this TextInput
		if ( ( this._input.isFocused() === false ) && ( this._input.props.isSelected === true ) ) {
			this.focus();
		}

		if ( this.state.clutchWidth !== '100%') {
			setTimeout(() => {
				this.setState( { clutchWidth: '100%'} )
			}, 100)
		}
	}

	focus() {
		this._input.focus();
	}

	render() {
		return (
			<TextInput
				{ ...this.props }
				style={ [ this.props.style, { width: this.state.clutchWidth } ] }
				removeClippedSubviews={ false }
				ref={ ( x ) => this._input = x }
				className={ [ styles[ 'editor-plain-text' ], this.props.className ] }
				onChangeText={ ( text ) => this.props.onChange( text ) }
			/>
		);
	}
}
