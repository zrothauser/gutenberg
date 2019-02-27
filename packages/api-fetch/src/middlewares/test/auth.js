/**
 * Internal dependencies
 */
import createAuthorizationMiddleware from '../auth';

describe( 'Authorization middleware', () => {
	it( 'should add an authorization header to the request', () => {
		expect.hasAssertions();

		const token = 'aToken';
		const authorizationMiddleware = createAuthorizationMiddleware( token );
		const requestOptions = {
			method: 'GET',
			path: '/wp/v2/posts',
		};
		const callback = ( options ) => {
			expect( options.headers.Authorization ).toBe( `Bearer aToken` );
		};

		authorizationMiddleware( requestOptions, callback );
	} );
} );
