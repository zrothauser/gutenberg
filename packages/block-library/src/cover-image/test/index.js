/**
 * Internal dependencies
 */
import { name, settings } from '../';
import { blockEditRender } from '../../test/helpers';
import { registerStore } from '@wordpress/data';

describe( 'core/cover-image', () => {
	test( 'block edit matches snapshot', () => {
		// The user can upload files.
		registerStore( 'core', {
			reducer( state = { hasUploadPermissions: true } ) {
				return state;
			},
			selectors: {
				hasUploadPermissions: ( state ) => state.hasUploadPermissions,
			},
		} );

		const wrapper = blockEditRender( name, settings );

		expect( wrapper ).toMatchSnapshot();
	} );
} );
