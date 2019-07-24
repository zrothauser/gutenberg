/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import deprecated from './deprecated';
import edit from './edit';
import icon from './icon';
import metadata from './block.json';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	title: __( 'Group' ),
	icon,
	description: __( 'A block that groups other blocks.' ),
	keywords: [ __( 'container' ), __( 'wrapper' ), __( 'row' ), __( 'section' ) ],
	supports: {
		align: [ 'wide', 'full' ],
		anchor: true,
		html: false,
	},
	attributes: {
		paddingUnit: {
			type: 'string',
			default: 'px',
		},
		marginUnit: {
			type: 'string',
			default: 'px',
		},
		paddingTop: {
			type: 'number',
			default: 0,
		},
		paddingRight: {
			type: 'number',
			default: 0,
		},
		paddingBottom: {
			type: 'number',
			default: 0,
		},
		paddingLeft: {
			type: 'number',
			default: 0,
		},
		marginTop: {
			type: 'number',
			default: 0,
		},
		marginRight: {
			type: 'number',
			default: 0,
		},
		marginBottom: {
			type: 'number',
			default: 0,
		},
		marginLeft: {
			type: 'number',
			default: 0,
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ '*' ],
				__experimentalConvert( blocks ) {
					// Avoid transforming a single `core/group` Block
					if ( blocks.length === 1 && blocks[ 0 ].name === 'core/group' ) {
						return;
					}

					const alignments = [ 'wide', 'full' ];

					// Determine the widest setting of all the blocks to be grouped
					const widestAlignment = blocks.reduce( ( result, block ) => {
						const { align } = block.attributes;
						return alignments.indexOf( align ) > alignments.indexOf( result ) ? align : result;
					}, undefined );

					// Clone the Blocks to be Grouped
					// Failing to create new block references causes the original blocks
					// to be replaced in the switchToBlockType call thereby meaning they
					// are removed both from their original location and within the
					// new group block.
					const groupInnerBlocks = blocks.map( ( block ) => {
						return createBlock( block.name, block.attributes, block.innerBlocks );
					} );

					return createBlock( 'core/group', {
						align: widestAlignment,
					}, groupInnerBlocks );
				},
			},

		],
	},

	edit,
	save,
	deprecated,
};
