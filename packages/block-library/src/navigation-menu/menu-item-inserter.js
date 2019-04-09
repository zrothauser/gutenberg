/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	compose,
	withState,
} from '@wordpress/compose';
import {
	withDispatch,
	withSelect,
} from '@wordpress/data';
import {
	Button,
	Dropdown,
	IconButton,
	MenuItem,
	NavigableMenu,
	TextControl,
	BaseControl,
} from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { isURL } from '@wordpress/url';

function MenuItemInserter( {
	insertMenuItem,
	isUrlInput,
	pageResults,
	searchInput,
	setState,
} ) {
	const onMenuItemClick = useCallback( () => {
		insertMenuItem( {
			destination: searchInput,
		} );
	}, [ insertMenuItem, searchInput ] );
	const onTextControlChange = useCallback( ( newInput ) => {
		setState( {
			searchInput: newInput,
			isUrlInput: isURL( newInput ),
		} );
	}, [ setState ] );

	return (
		<Dropdown
			className="wp-block-navigation-menu__inserter"
			position="bottom center"
			renderToggle={ ( { isOpen, onToggle } ) => (
				<IconButton
					icon="insert"
					label={ __( 'Insert a new menu item' ) }
					onClick={ onToggle }
					aria-expanded={ isOpen }
				/>
			) }
			renderContent={ () => (
				<div className="wp-block-navigation-menu__inserter-content">
					<TextControl
						value={ searchInput }
						label={ __( 'Search for a page' ) }
						help={ __( 'You can also paste a URL here.' ) }
						onChange={ onTextControlChange }
					/>
					{ isUrlInput && (
						<NavigableMenu>
							<MenuItem
								onClick={ onMenuItemClick }
								icon="admin-links"
							>
								{ searchInput }
							</MenuItem>
						</NavigableMenu>
					) }
					{ pageResults && !! pageResults.length && (
						<BaseControl>
							<BaseControl.VisualLabel>
								{ __( 'Search Results' ) }
							</BaseControl.VisualLabel>
							{ pageResults.map( ( page ) => {
								return (
									<div key={ page.id }>
										<span>
											{ get( page, [ 'title', 'rendered' ] ) }
										</span>
										<Button>
											{ __( 'Add to menu' ) }
										</Button>
									</div>
								);
							} ) }
						</BaseControl>
					) }

				</div>
			) }
		/>
	);
}

export default compose( [
	withDispatch( ( dispatch, props, { select } ) => {
		return {
			insertMenuItem( attributes ) {
				const {
					getBlockOrder,
				} = select( 'core/block-editor' );
				const {
					insertBlock,
				} = dispatch( 'core/block-editor' );
				const index = getBlockOrder( props.rootClientId ).length;
				const insertedBlock = createBlock(
					'core/navigation-menu-item',
					attributes
				);
				insertBlock(
					insertedBlock,
					index,
					props.rootClientId
				);
			},
		};
	} ),
	withState( {
		searchInput: '',
		isUrlInput: false,
	} ),
	withSelect( ( select, props ) => {
		if ( props.isUrlInput || ! props.searchInput ) {
			return;
		}
		const { getEntityRecords } = select( 'core' );
		const pagesQuery = {
			search: props.searchInput,
		};
		return {
			pageResults: getEntityRecords( 'postType', 'page', pagesQuery ),
		};
	} ),
] )( MenuItemInserter );
