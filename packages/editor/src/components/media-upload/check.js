/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

export function MediaUploadCheck( { hasUploadPermissions, fallback, children } ) {
	if ( ! hasUploadPermissions ) {
		return fallback || null;
	}

	return <Fragment>{ children }</Fragment>;
}

export default compose( [
	withSelect( ( select ) => {
		return {
			hasUploadPermissions: select( 'core' ).hasUploadPermissions(),
		};
	} ),
] )( MediaUploadCheck );
