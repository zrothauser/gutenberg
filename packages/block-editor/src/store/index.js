/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import applyMiddlewares from './middlewares';
import * as selectors from './selectors';
import * as actions from './actions';
import controls from './controls';
import { STORE_KEY } from './constants';

export const storeConfig = {
	reducer,
	selectors,
	actions,
	controls,
};

const store = registerStore( STORE_KEY, {
	...storeConfig,
	persist: [ 'preferences' ],
} );
applyMiddlewares( store );

export default store;
