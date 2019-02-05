/**
 * External dependencies
 */
// Needed to initialise the default datepicker styles.
// See: https://github.com/airbnb/react-dates#initialize
import 'react-dates/initialize';
import { DayPickerSingleDateController } from 'react-dates';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Module Constants
 */
const isRTL = () => document.documentElement.dir === 'rtl';

export default class Calendar extends Component {
	constructor( props ) {
		super( ...arguments );
		this.state = {
			date: props.date ? moment( props.date ) : moment(),
		};
		this.onChangeMoment = this.onChangeMoment.bind( this );
	}

	onChangeMoment( newDate ) {
		this.setState( {
			date: newDate,
		} );
	}

	render() {
		const date = this.props.date ? moment( this.props.date ) : moment();
		return (
			<div className="components-datetime__date">
				<DayPickerSingleDateController
					date={ date }
					daySize={ 30 }
					focused
					hideKeyboardShortcutsPanel
					// This is a hack to force the calendar to update on month or year change
					// https://github.com/airbnb/react-dates/issues/240#issuecomment-361776665
					key={ `datepicker-controller-${ date.format( 'MM-YYYY' ) }` }
					noBorder
					numberOfMonths={ 1 }
					onDateChange={ this.onChangeMoment }
					transitionDuration={ 0 }
					weekDayFormat="ddd"
					isRTL={ isRTL() }
				/>
			</div>
		);
	}
}
