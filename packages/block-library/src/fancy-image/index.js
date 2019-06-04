/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import icon from './icon';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'Fancy Image' ),
	description: __( 'Insert an artwork image with a custom caption.' ),
	supports: {
		align: [ 'wide', 'full' ],
		anchor: true,
	},
	icon,
	keywords: [
		'img', // "img" is not translated as it is intended to reflect the HTML <img> tag.
		__( 'Art' ),
		__( 'Artwork' ),
		__( 'Caption' ),
	],
	edit,
	save,
};
