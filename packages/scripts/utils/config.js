/**
 * External dependencies
 */
const { basename } = require( 'path' );

/**
 * Internal dependencies
 */
const { getArgsFromCLI, getFileArgsFromCLI, hasArgInCLI, hasFileArgInCLI } = require( './cli' );
const { fromConfigRoot, hasProjectFile } = require( './file' );
const { hasPackageProp } = require( './package' );
const { exit } = require( './process' );

const hasBabelConfig = () =>
	hasProjectFile( '.babelrc' ) ||
	hasProjectFile( '.babelrc.js' ) ||
	hasProjectFile( 'babel.config.js' ) ||
	hasPackageProp( 'babel' );

const hasJestConfig = () =>
	hasArgInCLI( '-c' ) ||
	hasArgInCLI( '--config' ) ||
	hasProjectFile( 'jest.config.js' ) ||
	hasProjectFile( 'jest.config.json' ) ||
	hasPackageProp( 'jest' );

const hasWebpackConfig = () => hasArgInCLI( '--config' ) ||
	hasProjectFile( 'webpack.config.js' ) ||
	hasProjectFile( 'webpack.config.babel.js' );

/**
 * Converts CLI arguments to the format which webpack understands.
 * It allows to optionally pass some additional webpack CLI arguments.
 *
 * @see https://webpack.js.org/api/cli/#usage-with-config-file
 *
 * @param {?Array} additionalArgs The list of additional CLI arguments.
 *
 * @return {Array} The list of CLI arguments to pass to webpack CLI.
 */
const getWebpackArgs = ( additionalArgs = [] ) => {
	let webpackArgs = getArgsFromCLI();

	const hasWebpackOutputOption = hasArgInCLI( '-o' ) || hasArgInCLI( '--output' );
	if ( hasFileArgInCLI() && ! hasWebpackOutputOption ) {
		/**
		 * Converts a path to the entry format supported by webpack, e.g.:
		 * `./entry-one.js` -> `entry-one=./entry-one.js`
		 * `entry-two.js` -> `entry-two=./entry-two.js`
		 *
		 * @param {string} path The path provided.
		 *
		 * @return {string} The entry format supported by webpack.
		 */
		const pathToEntry = ( path ) => {
			const entry = basename( path, '.js' );

			if ( ! path.startsWith( './' ) ) {
				path = './' + path;
			}

			return [ entry, path ].join( '=' );
		};

		// The following handles the support for multiple entry points in webpack, e.g.:
		// `wp-scripts build one.js custom=./two.js` -> `webpack one=./one.js custom=./two.js`
		webpackArgs = webpackArgs.map( ( cliArg ) => {
			if ( getFileArgsFromCLI().includes( cliArg ) && ! cliArg.includes( '=' ) ) {
				return pathToEntry( cliArg );
			}

			return cliArg;
		} );
	}

	if ( ! hasWebpackConfig() ) {
		webpackArgs.push( '--config', fromConfigRoot( 'webpack.config.js' ) );
	}

	webpackArgs.push( ...additionalArgs );

	return webpackArgs;
};

const supportedPlatforms = [ 'web', 'android', 'ios' ];

const getPlatform = () => {
	const platform = process.env.PLATFORM ? process.env.PLATFORM : 'web';

	if ( platform && ! supportedPlatforms.includes( platform ) ) {
		// eslint-disable-next-line no-console
		console.log( 'Unsupported platform "' + platform + "'" );
		exit( 1 );
	}

	return platform;
};

const getPlatformExtensions = ( platform ) => {
	switch ( platform ) {
		case 'web':
			return [ '.web.js', '.js' ];
		case 'android':
			return [ '.android.js', '.native.js', '.js' ];
		case 'ios':
			return [ '.ios.js', '.native.js', '.js' ];
		default:
			// eslint-disable-next-line no-console
			console.log( 'Unsupported platform "' + platform + "'" );
			exit( 1 );
	}
};

const getOutputExtension = ( platform ) => {
	switch ( platform ) {
		case 'web':
			return '.js';
		case 'android':
			return '.android.js';
		case 'ios':
			return '.ios.js';
		default:
			// eslint-disable-next-line no-console
			console.log( 'Unsupported platform "' + platform + "'" );
			exit( 1 );
	}
};

module.exports = {
	getOutputExtension,
	getPlatform,
	getPlatformExtensions,
	getWebpackArgs,
	hasBabelConfig,
	hasJestConfig,
};
