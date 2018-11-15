/**
 * External dependencies
 */
import { Component } from '@wordpress/element';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// This a class component as parent components may bind a ref to the input.
export class URLPopoverInput extends Component {
	render() {
		const {
			className,
			type = 'url',
			placeholder = __( 'Paste or type URL' ),
			...inputProps
		} = this.props;
		const classes = classnames( 'editor-url-popover__input', className );

		return (
			<input
				className={ classes }
				type={ type }
				placeholder={ placeholder }
				{ ...inputProps }
			/>
		);
	}
}
