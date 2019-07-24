/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	PanelColorSettings,
	withColors,
	DimensionControl,
} from '@wordpress/block-editor';

import {
	PanelBody,
} from '@wordpress/components';

function GroupEdit( {
	clientId,
	className,
	setBackgroundColor,
	backgroundColor,
	hasInnerBlocks,
	attributes,
	setAttributes,
} ) {
	const styles = {
		backgroundColor: backgroundColor.color,
	};

	const hasPadding = attributes.paddingSize !== '';
	const hasMargin = attributes.marginSize !== '';

	const classes = classnames( className, backgroundColor.class, {
		'has-background': !! backgroundColor.color,
		'has-padding': hasPadding,
		'has-margin': hasMargin,
		[ `padding-${ attributes.paddingSize }` ]: hasPadding,
		[ `margin-${ attributes.marginSize }` ]: hasMargin,
	} );

	return (
		<>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color' ),
						},
					] }
				/>

				<PanelBody title={ __( 'Spacing' ) }>
					<DimensionControl
						type="padding"
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ clientId }
					/>
					<DimensionControl
						type="margin"
						attributes={ attributes }
						setAttributes={ setAttributes }
						clientId={ clientId }
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ classes } style={ styles }>
				<div className="wp-block-group__inner-container">
					<InnerBlocks
						renderAppender={ ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</>
	);
}

export default compose( [
	withColors( 'backgroundColor' ),
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' );

		const block = getBlock( clientId );

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		};
	} ),
] )( GroupEdit );
