function createAuthorizationMiddleware( token ) {
	function middleware( options, next ) {
		const { headers = {} } = options;

		return next( {
			...options,
			headers: {
				...headers,
				Authorization: `Bearer ${ middleware.token }`,
			},
		} );
	}

	middleware.token = token;

	return middleware;
}

export default createAuthorizationMiddleware;
