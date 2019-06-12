/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( { caption, url, align, id } ) => (
				createBlock( 'core/fancy-image', {
					captionTitle: caption,
					src: url,
					align,
					id,
				} )
			),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( { captionTitle, captionMeta, src, align, id } ) => (
				createBlock( 'core/image', {
					caption: captionTitle + ' ' + captionMeta,
					url: src,
					align,
					id,
				} )
			),
		},
	],
};

export default transforms;
