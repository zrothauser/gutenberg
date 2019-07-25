/**
 * External dependencies
 */
import classnames from 'classnames';
import { partialRight, startCase } from 'lodash';

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
	Fragment,
} from '@wordpress/element';

import {
	PanelBody,
	ToggleControl,
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

	const hasPadding = ( device = '' ) => !! attributes[ `paddingSize${ device }` ];
	const hasMargin = ( device = '' ) => !! attributes[ `marginSize${ device }` ];

	const classes = classnames( className, backgroundColor.class, {
		'has-background': !! backgroundColor.color,
		'has-padding': hasPadding(),
		'has-margin': hasMargin(),
		'has-responsive-padding': attributes.responsivePadding,
		'has-responsive-margin': attributes.responsiveMargin,
		[ `padding-${ attributes.paddingSize }` ]: hasPadding(),
		[ `padding-tablet-${ attributes.paddingSizeTablet }` ]: attributes.responsivePadding && hasPadding( 'Tablet' ),
		[ `padding-mobile-${ attributes.paddingSizeMobile }` ]: attributes.responsivePadding && hasPadding( 'Mobile' ),
		[ `margin-${ attributes.marginSize }` ]: hasMargin(),
		[ `margin-tablet-${ attributes.marginSizeTablet }` ]: hasMargin( 'Tablet' ),
		[ `margin-mobile-${ attributes.marginSizeMobile }` ]: hasMargin( 'Mobile' ),
	} );

	/**
	 * Resets a single spacing attribute for a given dimension
	 * (and optionally a given device)
	 * @param  {string} dimension the dimension property (eg: `padding`)
	 * @param  {string} device    the device which this dimension applies to (eg: `mobile`, `tablet`)
	 * @return {void}
	 */
	const resetSpacingDimension = ( dimension, device = '' ) => {
		setAttributes( {
			[ `${ dimension }${ device }` ]: '',
		} );
	};

	/**
	 * Resets all the responsive attributes for a given dimension
	 * @param  {string} dimension the dimension property (eg: `padding`)
	 * @return {void}
	 */
	const resetResponsiveSpacingForDimension = ( dimension ) => {
		dimension = dimension.toLowerCase();

		setAttributes( {
			[ `${ dimension }SizeMobile` ]: '',
			[ `${ dimension }SizeTablet` ]: '',
		} );
	};

	/**
	 * Updates the spacing attribute for a given dimension
	 * (and optionally a given device)
	 * @param  {string} dimension the dimension property (eg: `padding`)
	 * @param  {string} size      a slug representing a dimension size (eg: `medium`)
	 * @param  {string} device    the device which this dimension applies to (eg: `mobile`, `tablet`)
	 * @return {void}
	 */
	const updateSpacing = ( dimension, size, device = '' ) => {
		setAttributes( {
			[ `${ dimension }${ device }` ]: size,
		} );
	};

	/**
	 * Toggles the responsive spacing UI for a given dimension
	 * and clears any responsive attribute
	 * @param  {string} dimension the dimension property (eg: `padding`)
	 * @return {void}
	 */
	const onToggleResponsiveSpacing = ( dimension ) => {
		dimension = startCase( dimension );

		const attr = `responsive${ dimension }`;
		const responsiveDimensionState = ! attributes[ attr ];

		if ( ! responsiveDimensionState ) {
			resetResponsiveSpacingForDimension( dimension );
		}
		setAttributes( {
			[ attr ]: responsiveDimensionState,
		} );
	};

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

					<fieldset className="block-editor-responsive-controls">
						<legend className="block-editor-responsive-controls__label">{ __( 'Padding' ) } </legend>
						<ToggleControl
							label={ __( 'Manually adjust Padding based on screensize?' ) }
							checked={ attributes.responsivePadding }
							onChange={ () => onToggleResponsiveSpacing( 'padding' ) }
						/>

						{ ! attributes.responsivePadding && (
							<DimensionControl
								title={ __( 'Padding' ) }
								property="padding"
								clientId={ clientId }
								onReset={ resetSpacingDimension }
								onSpacingChange={ updateSpacing }
								currentSize={ attributes.paddingSize }
								device="all"
								deviceIcon="desktop"
							/>
						) }

						{ attributes.responsivePadding && (
							<Fragment>
								<DimensionControl
									title={ __( 'Padding' ) }
									property="padding"
									clientId={ clientId }
									onReset={ resetSpacingDimension }
									onSpacingChange={ updateSpacing }
									currentSize={ attributes.paddingSize }
									device="desktop"
								/>

								<DimensionControl
									title={ __( 'Padding' ) }
									property="padding"
									clientId={ clientId }
									onReset={ partialRight( resetSpacingDimension, 'Tablet' ) }
									onSpacingChange={ partialRight( updateSpacing, 'Tablet' ) }
									currentSize={ attributes.paddingSizeTablet }
									device="tablet"
									deviceIcon="tablet"
								/>

								<DimensionControl
									title={ __( 'Padding' ) }
									property="padding"
									clientId={ clientId }
									onReset={ partialRight( resetSpacingDimension, 'Mobile' ) }
									onSpacingChange={ partialRight( updateSpacing, 'Mobile' ) }
									currentSize={ attributes.paddingSizeMobile }
									device="mobile"
									deviceIcon="smartphone"
								/>

							</Fragment>
						) }
					</fieldset>

					<fieldset className="block-editor-responsive-controls">
						<legend className="block-editor-responsive-controls__label">{ __( 'Margin' ) }</legend>
						<ToggleControl
							label={ __( 'Manually adjust Margin based on screensize?' ) }
							checked={ attributes.responsiveMargin }
							onChange={ () => onToggleResponsiveSpacing( 'margin' ) }
						/>

						{ ! attributes.responsiveMargin && (
							<DimensionControl
								title={ __( 'Margin' ) }
								property="margin"
								clientId={ clientId }
								onReset={ resetSpacingDimension }
								onSpacingChange={ updateSpacing }
								currentSize={ attributes.marginSize }
								device="all"
								deviceIcon="desktop"
							/>
						) }

						{ attributes.responsiveMargin && (
							<Fragment>
								<DimensionControl
									title={ __( 'Margin' ) }
									property="margin"
									clientId={ clientId }
									onReset={ resetSpacingDimension }
									onSpacingChange={ updateSpacing }
									currentSize={ attributes.marginSize }
									device="desktop"
								/>

								<DimensionControl
									title={ __( 'Margin' ) }
									property="margin"
									clientId={ clientId }
									onReset={ partialRight( resetSpacingDimension, 'Tablet' ) }
									onSpacingChange={ partialRight( updateSpacing, 'Tablet' ) }
									currentSize={ attributes.marginSizeTablet }
									device="tablet"
									deviceIcon="tablet"
								/>

								<DimensionControl
									title={ __( 'Margin' ) }
									property="margin"
									clientId={ clientId }
									onReset={ partialRight( resetSpacingDimension, 'Mobile' ) }
									onSpacingChange={ partialRight( updateSpacing, 'Mobile' ) }
									currentSize={ attributes.marginSizeMobile }
									device="mobile"
									deviceIcon="smartphone"
								/>

							</Fragment>
						) }
					</fieldset>

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
