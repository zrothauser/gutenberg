/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton } from '@wordpress/components';

export function URLPopoverSubmitButton( { className, type = 'submit', label = __( 'Apply' ), icon = 'editor-break', ...buttonProps } ) {
	const classes = classnames( 'editor-url-popover__submit-button', className );
	return (
		<IconButton
			className={ classes }
			label={ label }
			type={ type }
			icon={ icon }
			{ ...buttonProps }
		/>
	);
}
