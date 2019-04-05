/**
 * External dependencies
 */
import { invoke } from 'lodash';

/**
 * WordPress dependencies
 */
import { Dropdown, IconButton, NavigableMenu, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { PlainText } from '@wordpress/block-editor';
import { withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Component, createRef } from '@wordpress/element';

const MenuItemActions = compose( [
	withDispatch( ( dispatch, { clientId }, { select } ) => {
		const {
			getBlockOrder,
			getBlockRootClientId,
		} = select( 'core/block-editor' );
		const parentID = getBlockRootClientId( clientId );
		const {
			moveBlocksDown,
			moveBlocksUp,
			moveBlockToPosition,
			removeBlocks,
		} = dispatch( 'core/block-editor' );
		return {
			moveToStart() {
				moveBlockToPosition( clientId, parentID, parentID, 0 );
			},
			moveRight() {
				moveBlocksDown( clientId, parentID );
			},
			moveLeft() {
				moveBlocksUp( clientId, parentID );
			},
			moveToEnd() {
				moveBlockToPosition(
					clientId,
					parentID,
					parentID,
					getBlockOrder( parentID ).length - 1
				);
			},
			remove() {
				removeBlocks( clientId );
			},
		};
	} ),
] )( ( {
	destination,
	moveLeft,
	moveRight,
	moveToEnd,
	moveToStart,
	onEditLableClicked,
	remove,
} ) => {
	return (
		<NavigableMenu>
			<MenuItem
				icon="admin-links"
			>
				{ destination }
			</MenuItem>
			<MenuItem
				onClick={ onEditLableClicked }
				icon="edit"
			>
				{ __( 'Edit label text' ) }
			</MenuItem>
			<div className="wp-block-navigation-menu-item__separator" />
			<MenuItem
				onClick={ moveToStart }
				icon="arrow-up-alt2"
			>
				{ __( 'Move to start' ) }
			</MenuItem>
			<MenuItem
				onClick={ moveLeft }
				icon="arrow-left-alt2"
			>
				{ __( 'Move left' ) }
			</MenuItem>
			<MenuItem
				onClick={ moveRight }
				icon="arrow-right-alt2"
			>
				{ __( 'Move right' ) }
			</MenuItem>
			<MenuItem
				onClick={ moveToEnd }
				icon="arrow-down-alt2"
			>
				{ __( 'Move to end' ) }
			</MenuItem>
			<MenuItem
				icon="arrow-left-alt2"
			>
				{ __( 'Nest underneath…' ) }
			</MenuItem>
			<div className="navigation-menu-item__separator" />
			<MenuItem
				onClick={ remove }
				icon="trash"
			>
				{ __( 'Remove from menu' ) }
			</MenuItem>
		</NavigableMenu>
	);
} );

class NavigationMenuItemEdit extends Component {
	constructor() {
		super( ...arguments );
		this.plainTextRef = createRef();
		this.onEditLableClicked = this.onEditLableClicked.bind( this );
	}

	onEditLableClicked() {
		invoke(
			this.plainTextRef,
			[ 'current', 'textarea', 'focus' ]
		);
	}

	render() {
		const {
			attributes,
			clientId,
			isSelected,
			setAttributes,
		} = this.props;
		let content;
		if ( isSelected ) {
			content = (
				<div className="wp-block-navigation-menu-item__edit-cotainer">
					<PlainText
						ref={ this.plainTextRef }
						className="wp-block-navigation-menu-item__field"
						value={ attributes.label }
						onChange={ ( label ) => setAttributes( { label } ) }
						aria-label={ __( 'Navigation Label' ) }
						maxRows={ 1 }
					/>
					<Dropdown
						noArrow
						contentClassName="wp-block-navigation-menu-item__dropdown-content"
						position="bottom right"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<IconButton
								icon={ isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2' }
								label={ __( 'More options' ) }
								onClick={ onToggle }
								aria-expanded={ isOpen }
							/>
						) }
						renderContent={ () => (
							<MenuItemActions
								clientId={ clientId }
								destination={ attributes.destination }
								onEditLableClicked={ this.onEditLableClicked }
							/>
						) }
					/>
				</div>
			);
		} else {
			content = attributes.label;
		}
		return (
			<div className="wp-block-navigation-menu-item">
				{ content }
			</div>
		);
	}
}

export default NavigationMenuItemEdit;
