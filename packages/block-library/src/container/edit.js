/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import {
	Button,
	PanelBody,
	ResponsiveWrapper,
	Spinner,
} from '@wordpress/components';
import {
	InspectorControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	PanelColorSettings,
	withColors,
} from '@wordpress/editor';

const ALLOWED_MEDIA_TYPES = [ 'image' ];

function ImageUploadButton( { title, onSelect, media, url, id } ) {
	if ( ! url ) {
		return (
			<MediaUploadCheck fallback={ __( 'TODO' ) }>
				<MediaUpload
					title={ title }
					onSelect={ onSelect }
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					render={ ( { open } ) => (
						<Button className="wp-block-container__image-upload-button" onClick={ open }>
							{ __( 'Set Background Image' ) }
						</Button>
					) }
				/>
			</MediaUploadCheck>
		);
	}

	return (
		<MediaUploadCheck fallback={ __( 'TODO' ) }>
			<MediaUpload
				title={ title }
				onSelect={ onSelect }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
				render={ ( { open } ) => (
					<Button className="wp-block-container__image-upload-preview" onClick={ open } aria-label={ __( 'Edit or update the image' ) }>
						{ media &&
							<ResponsiveWrapper
								naturalWidth={ media.media_details.width }
								naturalHeight={ media.media_details.height }
							>
								<img src={ url } alt="" />
							</ResponsiveWrapper>
						}
						{ ! media && <Spinner /> }
					</Button>
				) }
				value={ id }
			/>
		</MediaUploadCheck>

	);
}

function ContainerEdit( { className, setBackgroundColor, backgroundColor, setAttributes, attributes, media } ) {
	const { backgroundImageURL, backgroundImageId } = attributes;

	const classes = classnames( className, backgroundColor.class, {
		'has-background-color': !! backgroundColor.color,
		'has-background-image': !! backgroundImageURL,
	} );

	const styles = {
		backgroundColor: backgroundColor.color,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
	};

	function onBackgroundColorSelect( color ) {
		setBackgroundColor( color );
		setAttributes( {
			backgroundImageURL: undefined,
			backgroundImageId: undefined,
		} );
	}

	function onBackgroundImageSelect( selectedMedia ) {
		if ( ! selectedMedia || ! selectedMedia.url ) {
			setAttributes( { backgroundImageURL: undefined, backgroundImageId: undefined } );
			return;
		}

		setAttributes( {
			backgroundColor: undefined,
			customBackgroundColor: undefined,
			backgroundImageURL: selectedMedia.url,
			backgroundImageId: selectedMedia.id,
		} );
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor.color,
							onChange: onBackgroundColorSelect,
							label: __( 'Background Color' ),
						},
					] }
				/>
				<PanelBody title={ __( 'Background Image Settings' ) }>
					<ImageUploadButton
						title={ __( 'Background Image' ) }
						media={ media }
						onSelect={ onBackgroundImageSelect }
						url={ backgroundImageURL }
						id={ backgroundImageId }
					/>
				</PanelBody>
			</InspectorControls>
			<div className={ classes } style={ styles }>
				<InnerBlocks />
			</div>
		</Fragment>
	);
}

export default compose(
	withSelect( ( select, { attributes } ) => ( {
		media: select( 'core' ).getMedia( attributes.backgroundImageId ),
	} ) ),
	withColors( 'backgroundColor' ),
)( ContainerEdit );
