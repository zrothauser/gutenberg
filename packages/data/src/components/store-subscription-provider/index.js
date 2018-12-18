/**
 * WordPress dependencies
 */
import { createContext, Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import defaultRegistry from '../../default-registry';

const { Consumer, Provider } = createContext();

class StoreSubscriptionProvider extends Component {
	constructor( props ) {
		super( ...arguments );

		this.onStoreChange = this.onStoreChange.bind( this );

		this.state = {
			registry: props.registry,
		};
	}

	componentDidMount() {
		this._isMounted = true;

		this.unsubscribe = this.props.registry.subscribe( this.onStoreChange );
	}

	componentWillUnmount() {
		this._isMounted = false;

		this.unsubscribe();
	}

	onStoreChange() {
		if ( ! this._isMounted ) {
			return;
		}

		this.setState( () => ( {
			registry: this.props.registry,
		} ) );
	}

	render() {
		return (
			<Provider value={ this.state }>
				{ this.props.children }
			</Provider>
		);
	}
}

StoreSubscriptionProvider.defaultProps = {
	registry: defaultRegistry,
};

export const StoreSubscriptionConsumer = Consumer;

export default StoreSubscriptionProvider;
