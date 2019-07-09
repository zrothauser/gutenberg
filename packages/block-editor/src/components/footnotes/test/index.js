/**
 * Internal dependencies
 */
import { unkeyBy } from '..';

describe( 'unkeyBy', () => {
	it( 'bla bla', () => {
		const object = {
			soup1: [
				{ vegetable: 'broccoli' },
				{ vegetable: 'carrot' },
			],
			soup2: [
				{ vegetable: 'beet' },
				{ vegetable: 'cabbage' },
			],
		};

		expect( unkeyBy( object, 'id' ) ).toEqual( [
			{ id: 'soup1', vegetable: 'broccoli' },
			{ id: 'soup1', vegetable: 'carrot' },
			{ id: 'soup2', vegetable: 'beet' },
			{ id: 'soup2', vegetable: 'cabbage' },
		] );
	} );
} );
