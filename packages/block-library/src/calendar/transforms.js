/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/legacy-widget' ],
			isMatch: ( { identifier } ) => {
				return identifier === 'WP_Widget_Calendar';
			},
			transform: ( { instance } ) => {
				const calendarBlock = createBlock( 'core/calendar' );
				if ( ! instance || ! ( instance.title ) ) {
					return calendarBlock;
				}
				return [
					createBlock( 'core/heading', {
						content: instance.title,
					} ),
					calendarBlock,
				];
			},
		},
	],
};

export default transforms;
