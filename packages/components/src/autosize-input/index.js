/**
 * External dependencies
 */
import { over, get, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element';

class AutosizeInput extends Component {
	constructor() {
		super( ...arguments );

		this.inputRef = createRef();

		// Assign input handler as preserving the original incoming `onInput`,
		// if passed.
		this.onInput = over( [
			this.resize.bind( this ),
			( event ) => get( this.props, [ 'onInput' ], noop )( event ),
		] );

		this.state = {
			width: null,
		};
	}

	componentDidMount() {
		this.resize();
	}

	resize() {
		const input = this.inputRef.current;

		// To avoid `scrollWidth` behaving as a `Math.max` between its current
		// width and scrollable width, always reset to a zero width.
		input.style.width = '0';
		const nextWidth = input.scrollWidth;

		this.setState( ( state ) => {
			if ( state.width !== nextWidth ) {
				return { width: nextWidth };
			}

			return null;
		} );
	}

	render() {
		let { style } = this.props;
		const { width } = this.state;
		if ( width !== null ) {
			style = { ...style, width };
		}

		return (
			<input
				ref={ this.inputRef }
				{ ...this.props }
				style={ style }
				onInput={ this.onInput }
			/>
		);
	}
}

export default AutosizeInput;
