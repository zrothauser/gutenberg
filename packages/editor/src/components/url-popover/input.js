/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export function URLPopoverInput( { className, type = 'url', placeholder = __( 'Paste or type URL' ), ...inputProps } ) {
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
