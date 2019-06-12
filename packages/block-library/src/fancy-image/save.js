/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

export default function FancyImageSave( { attributes } ) {
	const {
		src,
		alt,
		captionMeta,
		captionTitle,
	} = attributes;

	return (
		<figure>
			<img src={ src } alt={ alt } />
			<figcaption>
				<RichText.Content tagName="p" className="wp-block-fancy-image__title" value={ captionTitle } />
				<RichText.Content tagName="p" className="wp-block-fancy-image__meta" value={ captionMeta } />
			</figcaption>
		</figure>
	);
}
