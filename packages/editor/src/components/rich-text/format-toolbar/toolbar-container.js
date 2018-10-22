/**
 * External dependencies
 */
import classnames from 'classnames';

const ToolbarContainer = ( { children, isInline } ) => {
	const classes = classnames( 'editor-format-toolbar', {
		'editor-format-toolbar--inline': isInline,
	} );

	return (
		<div className={ classes }>
			{ children }
		</div>

	);
};

export default ToolbarContainer;
