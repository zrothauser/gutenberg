/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import {
	InnerBlocks,
	withColors,
} from '@wordpress/block-editor';

import {
	Fragment,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

function GroupEdit( props ) {
	const {
		className,
		backgroundColor,
		hasInnerBlocks,
		attributes,
	} = props;

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

	return (
		<Fragment>
			<Inspector { ...props } />
			<div className={ classes } style={ styles }>
				<div className="wp-block-group__inner-container">
					<InnerBlocks
						renderAppender={ ! hasInnerBlocks && InnerBlocks.ButtonBlockAppender }
					/>
				</div>
			</div>
		</Fragment>
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
