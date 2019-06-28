/**
 * External dependencies
 */
import { reduce, find, pick, keyBy, has, forEach } from 'lodash';
import memoize from 'memize';

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useRef, useEffect, useMemo } from '@wordpress/element';

const SOURCE_SCHEMA_VALUE_KEY_MAPPING = {
	meta: 'meta',
	post: 'property',
};

const createUseBlockSources = ( handlerCreators ) => ( blocks ) => {
	const handlers = handlerCreators.reduce( ( result, runHook ) => {
		const [ source, handler ] = runHook();
		result[ source ] = handler;
		return result;
	}, {} );

	const {
		sources,
		blockTypes,
	} = useSelect( ( select ) => {
		const { getSources } = select( 'core/editor' );
		const { getBlockTypes } = select( 'core/blocks' );

		return {
			sources: getSources(),
			blockTypes: getBlockTypes(),
		};
	} );

	const blockTypesByName = useMemo(
		() => keyBy( blockTypes, 'name' ),
		[ blockTypes ]
	);

	const getBlockTypeAttributesBySource = useMemo(
		() => memoize( ( blockType, source ) => (
			reduce( blockType.attributes, ( result, schema, name ) => (
				schema.source === source ? [ ...result, name ] : result
			), [] )
		) ),
		[ blockTypesByName ]
	);

	const { setSourceValues, resetBlocks } = useDispatch( 'core/editor' );

	const previousBlocks = useRef();

	useEffect( () => {
		const { current: previousBlocksValue } = previousBlocks;
		const isSyncing = ! previousBlocksValue;
		previousBlocks.current = blocks;

		if ( isSyncing ) {
			return;
		}

		blocks.forEach( ( block ) => {
			for ( const sourceName in sources ) {
				const attributeNames = getBlockTypeAttributesBySource( blockTypesByName[ block.name ], sourceName );
				if ( ! attributeNames.length ) {
					continue;
				}

				const { clientId } = block;
				const previousBlock = find( previousBlocksValue, { clientId } );
				if ( ! previousBlock || block !== previousBlock ) {
					const nextSourceValues = pick( block.attributes, attributeNames );
					if ( has( handlers, [ sourceName, 'onChange' ] ) ) {
						forEach( nextSourceValues, ( value, key ) => handlers[ sourceName ].onChange( key, value ) );
					}
					setSourceValues( sourceName, nextSourceValues );
				}
			}
		} );
	}, [ blocks ] );

	useEffect( () => {
		const nextBlocks = blocks.map( ( block ) => {
			let workingBlock = block;

			const blockType = blockTypesByName[ block.name ];
			for ( const [ sourceName, sourceValues ] of Object.entries( sources ) ) {
				const attributeNames = getBlockTypeAttributesBySource( blockType, sourceName );
				if ( ! attributeNames.length ) {
					continue;
				}

				if ( workingBlock === block ) {
					workingBlock = { ...workingBlock };
				}

				for ( const attributeName of attributeNames ) {
					const key = blockType.attributes[ attributeName ][ SOURCE_SCHEMA_VALUE_KEY_MAPPING[ sourceName ] ];
					workingBlock.attributes[ attributeName ] = sourceValues[ key ];
				}
			}

			return block;
		} );

		if ( nextBlocks !== blocks ) {
			// Reset previous blocks to treat as sync, to avoid recursion.
			previousBlocks.current = null;
			resetBlocks( nextBlocks );
		}
	}, [ sources ] );

	return blocks;
};

export default createUseBlockSources;
