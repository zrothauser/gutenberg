/**
 * External dependencies
 */
import {
	get,
	pick,
} from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	BlockIcon,
	MediaPlaceholder,
	BlockControls,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	useState,
} from '@wordpress/element';
import {
	IconButton,
	SVG,
	Rect,
	Path,
	Toolbar,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import icon from './icon';

const editImageIcon = (
	<SVG width={ 20 } height={ 20 } viewBox="0 0 20 20">
		<Rect x={ 11 } y={ 3 } width={ 7 } height={ 5 } rx={ 1 } />
		<Rect x={ 2 } y={ 12 } width={ 7 } height={ 5 } rx={ 1 } />
		<Path d="M13,12h1a3,3,0,0,1-3,3v2a5,5,0,0,0,5-5h1L15,9Z" />
		<Path d="M4,8H3l2,3L7,8H6A3,3,0,0,1,9,5V3A5,5,0,0,0,4,8Z" />
	</SVG>
);

const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const pickRelevantMediaFiles = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.src = get( image, [ 'sizes', 'large', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) || image.url;
	return imageProps;
};

const onSelectImage = ( media, setAttributes, setIsEditing ) => {
	if ( ! media || ! media.url ) {
		setAttributes( {
			src: undefined,
			alt: undefined,
			id: undefined,
			caption: undefined,
		} );
		return;
	}

	setIsEditing( false );

	setAttributes( {
		...pickRelevantMediaFiles( media ),
		width: undefined,
		height: undefined,
	} );
};

function ToggleEditingToolbarButton( { isEditing, setIsEditing } ) {
	return (
		<Toolbar>
			<IconButton
				className={ classnames( 'components-icon-button components-toolbar__control', { 'is-active': isEditing } ) }
				label={ __( 'Edit image' ) }
				aria-pressed={ isEditing }
				onClick={ () => setIsEditing( ! isEditing ) }
				icon={ editImageIcon }
			/>
		</Toolbar>
	);
}

export default function FancyImageEdit( { attributes, setAttributes } ) {
	const { id, src, alt } = attributes;
	const [ isEditing, setIsEditing ] = useState( ! src );
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

	if ( isEditing ) {
		return (
			<>
				{ !! src && (
					<BlockControls>
						<ToggleEditingToolbarButton
							isEditing={ isEditing }
							setIsEditing={ setIsEditing }
						/>
					</BlockControls>
				) }
				<MediaPlaceholder
					icon={ <BlockIcon icon={ icon } /> }
					labels={ labels }
					onSelect={ ( media ) => onSelectImage( media, setAttributes, setIsEditing ) }
					onSelectURL={ () => {} }
					onDoubleClick={ () => {} }
					onCancel={ !! src && ( () => {} ) }
					onError={ () => {} }
					accept="image/*"
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					value={ { id, src } }
					mediaPreview={ mediaPreview }
				/>
			</>
		);
	}

	return (
		<>
			<BlockControls>
				<ToggleEditingToolbarButton
					isEditing={ isEditing }
					setIsEditing={ setIsEditing }
				/>
			</BlockControls>
			<img src={ src } alt={ alt } />
		</>
	);
}
