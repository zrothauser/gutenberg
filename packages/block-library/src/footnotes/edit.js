/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

const style = { backgroundColor: 'navy', height: '10px' };

export default function FootnotesEdit( { attributes, clientId } ) {
	const { footnotes = [] } = attributes;
	const { addFootnotes, removeFootnotes } = useDispatch( 'core/block-editor' );

	useEffect( () => {
		addFootnotes( clientId, footnotes );
		return () => {
			removeFootnotes( clientId );
		};
	}, [ footnotes ] );

	return <div className="wp-block-footnotes" style={ style }><hr /></div>;
}
