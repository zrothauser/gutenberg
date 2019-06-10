/* eslint-disable no-console */

/**
 * External dependencies
 */
const crypto = require( 'crypto' );
const fs = require( 'fs-extra' );
const path = require( 'path' );
const glob = require( 'fast-glob' );
const ProgressBar = require( 'progress' );
const workerFarm = require( 'worker-farm' );
const { Readable, Writable, Transform } = require( 'stream' );
const memoize = require( 'memize' );

/**
 * Path to packages directory.
 *
 * @type {string}
 */
const PACKAGES_DIR = path.resolve( __dirname, '../../packages' );

const { BUILD_CACHE_TARGET = 'node_modules/.cache/gutenbuild' } = process.env;

const BUILD_CACHE_PATH = path.resolve( process.cwd(), BUILD_CACHE_TARGET );

const BUILD_CONFIGURATION_FILES = [
	// path.resolve( __dirname, './build.js' ),
	// path.resolve( __dirname, './build-worker.js' ),
	path.resolve( __dirname, './get-babel-config.js' ),
	path.resolve( __dirname, './get-packages.js' ),
	path.resolve( __dirname, './post-css-config.js' ),
	path.resolve( __dirname, '../../babel.config.js' ),
	path.resolve( __dirname, '../../package-lock.json' ),
	path.resolve( __dirname, '../../assets/stylesheets/_colors.scss' ),
	path.resolve( __dirname, '../../assets/stylesheets/_breakpoints.scss' ),
	path.resolve( __dirname, '../../assets/stylesheets/_variables.scss' ),
	path.resolve( __dirname, '../../assets/stylesheets/_mixins.scss' ),
	path.resolve( __dirname, '../../assets/stylesheets/_animations.scss' ),
	path.resolve( __dirname, '../../assets/stylesheets/_z-index.scss' ),
];

function getFilesChecksum( files ) {
	return files.reduce(
		( hash, file ) => hash.update( fs.readFileSync( file ) ),
		crypto.createHash( 'md5' )
	).digest( 'hex' );
}

const getPackageChecksum = memoize( ( file ) => getFilesChecksum( [
	path.resolve( PACKAGES_DIR, getPackageName( file ), 'package.json' ),
] ) );

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
 * Returns a stream transform which maps an individual stylesheet to its
 * package entrypoint. Unlike JavaScript which uses an external bundler to
 * efficiently manage rebuilds by entrypoints, stylesheets are rebuilt fresh
 * in their entirety from the build script.
 *
 * @return {Transform} Stream transform instance.
 */
function createStyleEntryTransform() {
	const packages = new Set;

	return new Transform( {
		objectMode: true,
		async transform( file, encoding, callback ) {
			// Only stylesheets are subject to this transform.
			if ( path.extname( file ) !== '.scss' ) {
				this.push( file );
				callback();
				return;
			}

			// Only operate once per package, assuming entries are common.
			const packageName = getPackageName( file );
			if ( packages.has( packageName ) ) {
				callback();
				return;
			}

			packages.add( packageName );
			const entries = await glob( path.resolve( PACKAGES_DIR, packageName, 'src/*.scss' ) );
			entries.forEach( ( entry ) => this.push( entry ) );
			callback();
		},
	} );
}

let onFileComplete = () => {};

let stream;

const buildFiles = process.argv.slice( 2 );

if ( buildFiles.length ) {
	stream = new Readable( { encoding: 'utf8' } );
	buildFiles.forEach( ( file ) => stream.push( file ) );
	stream.push( null );
	stream = stream.pipe( createStyleEntryTransform() );
} else {
	const bar = new ProgressBar( 'Build Progress: [:bar] :percent', {
		width: 30,
		incomplete: ' ',
		total: 1,
	} );

	bar.tick( 0 );

	stream = glob.stream( [
		`${ PACKAGES_DIR }/*/src/**/*.js`,
		`${ PACKAGES_DIR }/*/src/*.scss`,
	], {
		ignore: [
			`**/test/**`,
			`**/__mocks__/**`,
		],
		onlyFiles: true,
	} );

	// Pause to avoid data flow which would begin on the `data` event binding,
	// but should wait until worker processing below.
	//
	// See: https://nodejs.org/api/stream.html#stream_two_reading_modes
	stream
		.pause()
		.on( 'data', ( file ) => {
			bar.total = buildFiles.push( file );
		} );

	onFileComplete = () => {
		bar.tick();
	};
}

const worker = workerFarm( require.resolve( './build-worker' ) );

const buildConfigurationChecksum = getFilesChecksum( BUILD_CONFIGURATION_FILES );

let ended = false,
	complete = 0;

const build = new Transform( {
	objectMode: true,
	async transform( file, encoding, callback ) {
		const checksum = crypto
			.createHash( 'md5' )
			.update( buildConfigurationChecksum )
			.update( getPackageChecksum( file ) )
			.update( getFilesChecksum( [ file ] ) )
			.digest( 'hex' );

		let cached;
		try {
			cached = await fs.readdir( path.resolve( BUILD_CACHE_PATH, checksum ) );
		} catch ( error ) {}

		if ( ! Array.isArray( cached ) ) {
			cached = [];

			await new Promise( ( resolve, reject ) => {
				worker( file, async ( error, built ) => {
					if ( error ) {
						// If an error occurs, the process can't be ended immediately since
						// other workers are likely pending. Optimally, it would end at the
						// earliest opportunity (after the current round of workers has had
						// the chance to complete), but this is not made directly possible
						// through `worker-farm`. Instead, ensure at least that when the
						// process does exit, it exits with a non-zero code to reflect the
						// fact that an error had occurred.
						process.exitCode = 1;

						console.error( error );
						reject( error );
					} else {
						for ( const [ relativeDestination, contents ] of Object.entries( built ) ) {
							const absoluteDestination = path.resolve( BUILD_CACHE_PATH, checksum, relativeDestination );
							await fs.mkdirp( path.dirname( absoluteDestination ) );
							await fs.writeFile( absoluteDestination, contents );
							cached.push( [ checksum, relativeDestination ] );
						}

						resolve();
					}
				} );
			} );
		}

		cached = await fs.readdir( path.resolve( BUILD_CACHE_PATH, checksum ) );
		cached.forEach( ( entry ) => this.push( [ checksum, entry ] ) );
		if ( ended && ++complete === buildFiles.length ) {
			workerFarm.end( worker );
		}

		onFileComplete();
		callback();
	},
} );

const write = new Writable( {
	objectMode: true,
	async write( [ checksum, relativePath ], encoding, callback ) {
		await fs.copy(
			path.resolve( BUILD_CACHE_PATH, checksum, relativePath ),
			path.resolve( PACKAGES_DIR, relativePath ),
		);

		callback();
	},
} );

stream
	.pipe( build )
	.on( 'end', () => ended = true )
	.resume()
	.pipe( write );
