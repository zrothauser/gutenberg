/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import {
	InnerBlocks,
} from '@wordpress/block-editor';
import MenuItemInserter from './menu-item-inserter'

class NavigationMenu extends Component {
	render() {
		const { isSelected, clientId } = this.props;
		return (
			<div className="wp-block-navigation-menu">
				<InnerBlocks
					template={ [
						[ 'core/navigation-menu-item', { label: 'Home', destination: 'http://yah.local/' } ],
						[ 'core/navigation-menu-item', { label: 'Cakes', destination: 'http://yah.local/cakes' } ],
						[ 'core/navigation-menu-item', { label: 'About', destination: 'http://yah.local/about' } ],
					] }
				/>
				{ isSelected && (
					<MenuItemInserter
						rootClientId={ clientId }
					/>
				) }
			</div>
		);
	}
}

export default NavigationMenu;
