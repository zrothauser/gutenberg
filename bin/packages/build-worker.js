/**
 * External dependencies
 */
const { promisify } = require( 'util' );
const fs = require( 'fs' );
const path = require( 'path' );
const babel = require( '@babel/core' );
const makeDir = require( 'make-dir' );
const sass = require( 'node-sass' );
const postcss = require( 'postcss' );
const crypto = require( 'crypto' );

/**
 * Internal dependencies
 */
const getBabelConfig = require( './get-babel-config' );

/**
 * Path to packages directory.
 *
 * @type {string}
 */
const PACKAGES_DIR = path.resolve( __dirname, '../../packages' );

const CACHE_DIR = path.resolve( __dirname, '../../node_modules/.cache/build' );

/**
 * Mapping of JavaScript environments to corresponding build output.
 *
 * @type {Object}
 */
const JS_ENVIRONMENTS = {
	main: 'build',
	module: 'build-module',
};

/**
 * Promisified fs.readFile.
 *
 * @type {Function}
 */
const readFile = promisify( fs.readFile );

/**
 * Promisified fs.writeFile.
 *
 * @type {Function}
 */
const writeFile = promisify( fs.writeFile );

const exists = promisify( fs.exists );

/**
 * Promisified sass.render.
 *
 * @type {Function}
 */
const renderSass = promisify( sass.render );

/**
 * Get the package name for a specified file
 *
 * @param  {string} file File name
 * @return {string}      Package name
 */
function getPackageName( file ) {
	return path.relative( PACKAGES_DIR, file ).split( path.sep )[ 0 ];
}

/**
 * Get Build Path for a specified file.
 *
 * @param  {string} file        File to build
 * @param  {string} buildFolder Output folder
 * @return {string}             Build path
 */
function getBuildPath( file, buildFolder ) {
	const pkgName = getPackageName( file );
	const pkgSrcPath = path.resolve( PACKAGES_DIR, pkgName, 'src' );
	const pkgBuildPath = path.resolve( PACKAGES_DIR, pkgName, buildFolder );
	const relativeToSrcPath = path.relative( pkgSrcPath, file );
	return path.resolve( pkgBuildPath, relativeToSrcPath );
}

function md5( text ) {
	const hash = crypto.createHash( 'md5' );
	hash.update( text, 'utf8' );
	return hash.digest( 'hex' );
}

async function memoize( hash, resolver ) {
	const file = path.resolve( CACHE_DIR, hash );

	if ( await exists( file ) ) {
		const contents = await readFile( file );
		return JSON.parse( contents );
	}

	const object = await resolver();

	const contents = JSON.stringify( object );
	await makeDir( path.dirname( file ) );
	await writeFile( file, contents );

	return object;
}

/**
 * Object of build tasks per file extension.
 *
 * @type {Object<string,Function>}
 */
const BUILD_TASK_BY_EXTENSION = {
	async '.scss'( file ) {
		const outputFile = getBuildPath( file.replace( '.scss', '.css' ), 'build-style' );
		const outputFileRTL = getBuildPath( file.replace( '.scss', '-rtl.css' ), 'build-style' );

		const [ , contents ] = await Promise.all( [
			makeDir( path.dirname( outputFile ) ),
			readFile( file, 'utf8' ),
		] );

		const { css, rtlCSS } = await memoize( md5( contents ), async () => {
			const builtSass = await renderSass( {
				file,
				includePaths: [ path.resolve( __dirname, '../../assets/stylesheets' ) ],
				data: (
					[
						'colors',
						'breakpoints',
						'variables',
						'mixins',
						'animations',
						'z-index',
					].map( ( imported ) => `@import "${ imported }";` ).join( ' ' )	+
					contents
				),
			} );

			const result = await postcss( require( './post-css-config' ) ).process( builtSass.css, {
				from: 'src/app.css',
				to: 'dest/app.css',
			} );

			const resultRTL = await postcss( [ require( 'rtlcss' )() ] ).process( result.css, {
				from: 'src/app.css',
				to: 'dest/app.css',
			} );

			return { css: result.css, rtlCSS: resultRTL.css };
		} );

		await Promise.all( [
			writeFile( outputFile, css ),
			writeFile( outputFileRTL, rtlCSS ),
		] );
	},

	async '.js'( file ) {
		for ( const [ environment, buildDir ] of Object.entries( JS_ENVIRONMENTS ) ) {
			const destPath = getBuildPath( file, buildDir );

			const [ , contents ] = await Promise.all( [
				makeDir( path.dirname( destPath ) ),
				readFile( file ),
			] );

			const { map, code } = await memoize( md5( contents ), async () => {
				const babelOptions = getBabelConfig(
					environment,
					file.replace( PACKAGES_DIR, '@wordpress' )
				);

				const transformed = await babel.transformFileAsync( file, babelOptions );

				return {
					map: JSON.stringify( transformed.map ),
					code: transformed.code + '\n//# sourceMappingURL=' + path.basename( destPath ),
				};
			} );

			await Promise.all( [
				writeFile( destPath + '.map', map ),
				writeFile( destPath, code ),
			] );
		}
	},
};

module.exports = async ( file, callback ) => {
	const extension = path.extname( file );
	const task = BUILD_TASK_BY_EXTENSION[ extension ];

	if ( ! task ) {
		return;
	}

	try {
		await task( file );
		callback();
	} catch ( error ) {
		callback( error );
	}
};
