/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withDispatch } from '@wordpress/data';
import { Dropdown, IconButton, TextControl, NavigableMenu, MenuItem } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { isURL } from '@wordpress/url';

class MenuItemInserter extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			currentSearchInput: '',
			isUrlInput: false,
		};
		this.onChangeSearchInput = this.onChangeSearchInput.bind( this );
	}

	onChangeSearchInput( value ) {
		this.setState( {
			isUrlInput: isURL( value ),
			currentSearchInput: value,
		} );
	}

	render() {
		const { insertMenuItem } = this.props;
		const { currentSearchInput, isUrlInput } = this.state;
		return (
			<Dropdown
				className="block-menu-item-inserter"
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
					<div className="block-menu-item-inserter__content">
						<TextControl
							value={ currentSearchInput }
							label={ __( 'Search or paste a link' ) }
							onChange={ this.onChangeSearchInput }
						/>
						{ isUrlInput && (
							<NavigableMenu className="block-menu-item-inserter__content-menu">
								<MenuItem
									className="block-menu-item-inserter__content-menu-item"
									onClick={ () => {
										insertMenuItem( {
											destination: currentSearchInput,
										} );
									} }
									icon="admin-links"
								>
									{ currentSearchInput }
								</MenuItem>
							</NavigableMenu>
						) }
					</div>
				) }
			/>
		);
	}
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
				const insertedBlock = createBlock( 'core/navigation-menu-item', attributes );
				insertBlock(
					insertedBlock,
					index,
					props.rootClientId
				);
			},
		};
	} ),
] )( MenuItemInserter );
