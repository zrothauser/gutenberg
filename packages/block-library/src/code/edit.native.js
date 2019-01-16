/**
 * External dependencies
 */
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PlainText } from '@wordpress/editor';

/**
 * Block code style
 */
import styles from './theme.scss';

const minHeight = 50;

// Note: styling is applied directly to the (nested) PlainText component. Web-side components
// apply it to the container 'div' but we don't have a proper proposal for cascading styling yet.
export default class CodeEdit extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			aztecHeight: 0,
		};
	}

	render() {
		const { attributes, setAttributes, style, onFocus, onBlur } = this.props;
		console.log( [attributes.content ]);
		return (
			<View>
				<PlainText
					value={ attributes.content }
					tagName={ 'code' }
					style={ [style, {
						minHeight: Math.max( minHeight, this.state.aztecHeight ),
					} ] }
					multiline={ true }
					underlineColorAndroid="transparent"
					onChange={ ( content ) => setAttributes( { content } ) }
					placeholder={ __( 'Write code…' ) }
					aria-label={ __( 'Code' ) }
					isSelected={ this.props.isSelected }
					onFocus={ onFocus }
					onBlur={ onBlur }
					onContentSizeChange={ ( event ) => {
						this.setState( { aztecHeight: event.aztecHeight } );
					} }
				/>
			</View>
		);
	}

}