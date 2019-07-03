/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dateI18n } from '@wordpress/date';
import { withSelect } from '@wordpress/data';

export function PostScheduleLabel( { date, isFloating } ) {
	const formatWithTimezone = 'M j, Y g:i a T';

	return date && ! isFloating ?
		dateI18n( formatWithTimezone, date ) :
		__( 'Immediately' );
}

export default withSelect( ( select ) => {
	return {
		date: select( 'core/editor' ).getEditedPostAttribute( 'date' ),
		isFloating: select( 'core/editor' ).isEditedPostDateFloating(),
	};
} )( PostScheduleLabel );
