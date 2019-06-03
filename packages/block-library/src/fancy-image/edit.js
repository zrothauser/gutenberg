/**
 * External dependencies
 */
import {
	get,
	pick,
} from 'lodash';
/**
 * WordPress dependencies
 */
import {
	BlockIcon,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import icon from './icon';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const pickRelevantMediaFiles = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.src = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) || image.url;
	return imageProps;
};

const onSelectImage = ( media, setAttributes ) => {
	if ( ! media || ! media.url ) {
		setAttributes( {
			src: undefined,
			alt: undefined,
			id: undefined,
			caption: undefined,
		} );
		return;
	}

	// this.setState( {
	// 	isEditing: false,
	// } );

	setAttributes( {
		...pickRelevantMediaFiles( media ),
		width: undefined,
		height: undefined,
	} );
};

export default function FancyImageEdit( { attributes, setAttributes } ) {
	const { id, src } = attributes;
	const labels = {
		title: ! src ? __( 'Fancy Image' ) : __( 'Edit fancy image' ),
		instructions: __( 'Drag a very fancy image to upload, select a file from your library or add one from an URL.' ),
	};
	const mediaPreview = ( !! src && <img
		alt={ __( 'Edit image' ) }
		title={ __( 'Edit image' ) }
		className={ 'edit-image-preview' }
		src={ src }
	/> );
	return (
		<MediaPlaceholder
			icon={ <BlockIcon icon={ icon } /> }
			labels={ labels }
			onSelect={ ( media ) => onSelectImage( media, setAttributes ) }
			onSelectURL={ () => {} }
			onDoubleClick={ () => {} }
			onCancel={ !! src && ( () => {} ) }
			onError={ () => {} }
			accept="image/*"
			allowedTypes={ ALLOWED_MEDIA_TYPES }
			value={ { id, src } }
			mediaPreview={ mediaPreview }
		/>
	);
}
