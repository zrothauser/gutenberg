/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { footnotes = [] } = attributes;

	return (
		<ul className="wp-block-footnotes">
			{ footnotes.map( ( { id, content } ) =>
				<li key={ id } id={ `${ id }` }>
					<RichText.Content tagName="span" value={ content } />
					<a href={ `#${ id }-anchor` }>^</a>
				</li>
			) }
		</ul>
	);
}
