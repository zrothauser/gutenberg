/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import {
	Calendar,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';

class CalendarEdit extends Component {
	render() {
		return <Calendar date={ this.props.postDate } />;
	}
}

export default withSelect( ( select ) => {
	return {
		postDate: select( 'core/editor' ).getEditedPostAttribute( 'date' ),
	};
} )( CalendarEdit );
