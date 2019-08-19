/**
 * WordPress dependencies
 */
import {
	SlotFillProvider,
	Popover,
	navigateRegions,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ViewportMatchWidthProvider } from '@wordpress/viewport';

/**
 * Internal dependencies
 */
import WidgetAreas from '../widget-areas';

import './sync-customizer';

const CUSTOMIZER_PANEL_WIDTH = 275;

function CustomizerEditWidgetsInitializer( { settings } ) {
	return (
		<ViewportMatchWidthProvider width={ CUSTOMIZER_PANEL_WIDTH }>
			<SlotFillProvider>
				<div
					className="edit-widgets-customizer-edit-widgets-initializer__content"
					role="region"
					aria-label={ __( 'Widgets screen content' ) }
					tabIndex="-1"
				>
					<WidgetAreas blockEditorSettings={ settings } />
				</div>
				<Popover.Slot className="edit-widgets-popover-slot" />
			</SlotFillProvider>
		</ViewportMatchWidthProvider>
	);
}

export default navigateRegions( CustomizerEditWidgetsInitializer );
