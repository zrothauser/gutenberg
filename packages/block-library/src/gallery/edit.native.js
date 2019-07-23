/**
 * WordPress dependencies
 */
 import { Component, LI, UL } from '@wordpress/element';
 import { compose } from '@wordpress/compose';
 import { withNotices } from '@wordpress/components';
 import { __, sprintf } from '@wordpress/i18n';
 /**
 * External dependencies
 */
import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

/**
 * Internal dependencies
 */
import { defaultColumnsNumber, pickRelevantMediaFiles } from './shared';
import { withSelect } from '@wordpress/data';
import styles from './style.scss';

class GalleryEdit extends Component {
	constructor() {
		super( ...arguments );
	}
	
	render() {
		const { attributes, isSelected, className, noticeUI } = this.props;
		const { images, columns = defaultColumnsNumber( attributes ), align, imageCrop, linkTo } = attributes;

		return (
			<UL classname={ className } style={ styles['wp-block-gallery'] }>

				{ images.map( ( img, index ) => {
						/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
						const ariaLabel = sprintf( __( 'image %1$d of %2$d in gallery' ), ( index + 1 ), images.length );
						return (
							<LI style={ styles['blocks-gallery-item'] } key={ img.id || img.url }>
								<ImageBackground
									style={ styles['blocks-gallery-item'] } key={ img.id || img.url }
									resizeMethod="scale"
									source={ { uri: img.url } }
									key={ img.url }
								>
									<Text>{ ariaLabel }</Text>
								</ImageBackground>	
							</LI>
						);
					} ) }
			</UL>
		);
	}
}
export default compose( [
	withSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		const {
			__experimentalMediaUpload,
		} = getSettings();

		return {
			mediaUpload: __experimentalMediaUpload,
		};
	} ),
	withNotices,
] )( GalleryEdit );