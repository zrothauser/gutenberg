/**
 * WordPress dependencies
 */
import { Path, SVG, Dropdown, IconButton, NavigableMenu, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BlockMover, PlainText } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { Component } from '@wordpress/element';

export const name = 'core/navigation-menu-item';

class NavigationMenuItemEdit extends Component {
	render() {
		const { attributes, clientId, setAttributes, isSelected } = this.props;
		const blockElementId = `block-${ clientId }`;
		if ( isSelected ) {
			return (
				<div className="menu-item">
					<BlockMover
						blockElementId={ blockElementId }
						clientIds={ clientId }
						isDraggable={ true }
						onDragStart={ () => {} }
						onDragEnd={ () => {} }
					/>
					<div className="menu-item-input">
						<PlainText
							className="menu-item-input__field"
							value={ attributes.label }
							onChange={ ( label ) => setAttributes( { label } ) }
							aria-label={ __( 'Navigation Label' ) }
							maxRows={ 1 }
						/>
						<Dropdown
							className="menu-item-input__dropdown"
							contentClassName="menu-item-input__dropdown-content"
							position="bottom left"
							renderToggle={ ( { isOpen, onToggle } ) => (
								<IconButton
									icon={ isOpen ? 'arrow-up-alt2' : 'arrow-down-alt2' }
									label="More"
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							) }
							renderContent={ () => (
								<NavigableMenu>
									<MenuItem
										className="navigation-menu-item__link-menu-item"
										icon="admin-links"
									>
										{ attributes.destination }
									</MenuItem>
									<div className="navigation-menu-item__separator" />
									<MenuItem
										icon="arrow-up-alt2"
									>
										{ __( 'Move to start of menu' ) }
									</MenuItem>
									<MenuItem
										icon="arrow-down-alt2"
									>
										{ __( 'Move to end of menu' ) }
									</MenuItem>
									<MenuItem
										icon="arrow-left-alt2"
									>
										{ __( 'Nest underneath…' ) }
									</MenuItem>
									<MenuItem
										icon="leftright"
									>
										{ __( 'Move to position…' ) }
									</MenuItem>
									<div className="navigation-menu-item__separator" />
									<MenuItem
										icon="trash"
									>
										{ __( 'Remove from menu' ) }
									</MenuItem>
								</NavigableMenu>
							) }
						/>
					</div>
				</div>
			);
		}
		return (
			<span className="menu-item-item">
				{ attributes.label }
			</span>
		);
	}
}

const edit = compose(
	withSelect( ( select, { clientId } ) => {
		const { getBlockRootClientId } = select( 'core/editor' );

		return {
			parentID: getBlockRootClientId( clientId ),
		};
	} ),
)( NavigationMenuItemEdit );

export const settings = {
	title: __( 'Menu Item (Experimental)' ),

	parent: [ 'core/navigation-menu' ],

	icon: <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z" /></SVG>,

	description: __( 'A single menu item.' ),

	category: 'common',

	attributes: {
		label: {
			type: 'string',
		},
		destination: {
			type: 'string',
		},
	},

	supports: {},

	edit,

	save( { attributes } ) {
		return (
			<li>
				<a href={ attributes.destination }>
					{ attributes.label }
				</a>
			</li>
		);
	},
};

