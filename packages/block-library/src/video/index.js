/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/editor';
import { createBlock } from '@wordpress/blocks';
import { createBlobURL } from '@wordpress/blob';
import { SVG, Path } from '@wordpress/components';

/**
 * Internal dependencies
 */
import edit from './edit';

export const name = 'core/video';

export const settings = {
	title: __( 'Video' ),

	description: __( 'Embed a video from your media library or upload a new one.' ),

	icon: <SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M4 6l2 4h14v8H4V6m18-2h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4L2 6v12l2 2h16l2-2V4z" /></SVG>,

	keywords: [ __( 'movie' ) ],

	category: 'common',

	attributes: {
		autoplay: {
			type: 'boolean',
			source: 'attribute',
			selector: 'video',
			attribute: 'autoplay',
		},
		caption: {
			type: 'string',
			source: 'html',
			selector: 'figcaption',
		},
		controls: {
			type: 'boolean',
			source: 'attribute',
			selector: 'video',
			attribute: 'controls',
			default: true,
		},
		loop: {
			type: 'boolean',
			source: 'attribute',
			selector: 'video',
			attribute: 'loop',
		},
		muted: {
			type: 'boolean',
			source: 'attribute',
			selector: 'video',
			attribute: 'muted',
		},
		poster: {
			type: 'string',
			source: 'attribute',
			selector: 'video',
			attribute: 'poster',
		},
		preload: {
			type: 'string',
			source: 'attribute',
			selector: 'video',
			attribute: 'preload',
			default: 'metadata',
		},
		sources: {
			type: 'array',
			default: [],
			source: 'query',
			selector: 'source',
			query: {
				src: {
					source: 'attribute',
					attribute: 'src',
				},
				type: {
					source: 'attribute',
					attribute: 'type',
				},
			},
		},
		subtitles: {
			type: 'array',
			default: [],
			source: 'query',
			selector: 'track',
			query: {
				src: {
					source: 'attribute',
					attribute: 'src',
				},
				srclang: {
					source: 'attribute',
					attribute: 'srclang',
				},
				kind: {
					source: 'attribute',
					attribute: 'kind',
				},
				label: {
					source: 'attribute',
					attribute: 'label',
				},
			},
		},
	},

	transforms: {
		from: [
			{
				type: 'files',
				isMatch( files ) {
					return files.length === 1 && files[ 0 ].type.indexOf( 'video/' ) === 0;
				},
				transform( files ) {
					const file = files[ 0 ];
					// We don't need to upload the media directly here
					// It's already done as part of the `componentDidMount`
					// in the video block
					const block = createBlock( 'core/video', {
						src: createBlobURL( file ),
					} );
					return block;
				},
			},
		],
	},

	supports: {
		align: true,
	},

	edit,

	save( { attributes } ) {
		const { autoplay, caption, controls, loop, muted, poster, preload, sources, subtitles } = attributes;
		return (
			<figure>
				{ !! sources.length &&
				<video
					autoPlay={ autoplay }
					controls={ controls }
					loop={ loop }
					muted={ muted }
					preload={ preload }
					poster={ poster }
				>
					{ sources.map( ( source ) => {
						return (
							<source
								key={ source.src }
								src={ source.src }
								type={ source.type }
							/>
						);
					} ) }
					{ subtitles.map( ( subtitle ) => {
						return (
							<track
								key={ subtitle.src }
								srcLang={ subtitle.srclang }
								label={ subtitle.label }
								kind={ subtitle.kind }
								src={ subtitle.src }
							/>
						);
					} ) }
				</video>
				}
				{ ! RichText.isEmpty( caption ) && (
					<RichText.Content tagName="figcaption" value={ caption } />
				) }
			</figure>
		);
	},
};
