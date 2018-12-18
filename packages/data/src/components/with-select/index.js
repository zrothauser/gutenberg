/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { StoreSubscriptionConsumer } from '../store-subscription-provider';

/**
 * Higher-order component used to inject state-derived props using registered
 * selectors.
 *
 * @param {Function} mapSelectToProps Function called on every state change,
 *                                   expected to return object of props to
 *                                   merge with the component's own props.
 *
 * @return {Component} Enhanced component with merged state data props.
 */
const withSelect = ( mapSelectToProps ) => createHigherOrderComponent( ( WrappedComponent ) => {
	/**
	 * Default merge props. A constant value is used as the fallback since it
	 * can be more efficiently shallow compared in case component is repeatedly
 	 * rendered without its own merge props.
	 *
	 * @type {Object}
	 */
	const DEFAULT_MERGE_PROPS = {};

	/**
	 * Given a props object, returns the next merge props by mapSelectToProps.
	 *
	 * @param {WPDataRegistry} registry Contextual data registry.
	 * @param {Object}         ownProps The incoming props to the component.
	 *
	 * @return {Object} Props to merge into rendered wrapped element.
	 */
	function getNextMergeProps( registry, ownProps ) {
		return (
			mapSelectToProps( registry.select, ownProps, registry ) ||
			DEFAULT_MERGE_PROPS
		);
	}

	const PureEnhancedComponent = pure( WrappedComponent );

	return ( ownProps ) => (
		<StoreSubscriptionConsumer>
			{ ( { registry } ) => (
				<PureEnhancedComponent
					{ ...ownProps }
					{ ...getNextMergeProps( registry, ownProps ) }
				/>
			) }
		</StoreSubscriptionConsumer>
	);
}, 'withSelect' );

export default withSelect;
