/**
 * External dependencies
 */
import classnames from 'classnames';

export function URLPopoverForm( { className, children, ...formProps } ) {
	const classes = classnames( 'editor-url-popover__form', className );
	return (
		<form
			className={ classes }
			{ ...formProps }
		>
			{ children }
		</form>
	);
}
