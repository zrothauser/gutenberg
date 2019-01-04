/**
 * WordPress dependencies
 */
import {
	registerBlockType,
	setDefaultBlockName,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as code from './code';
import * as heading from './heading';
import * as mediaText from './media-text';
import * as more from './more';
import * as paragraph from './paragraph';
import * as image from './image';
import * as nextpage from './nextpage';

export const registerCoreBlocks = () => {
	[
		paragraph,
		heading,
		code,
		mediaText,
		more,
		image,
		nextpage,
	].forEach( ( { name, settings } ) => {
		registerBlockType( name, settings );
	} );
};

setDefaultBlockName( paragraph.name );
