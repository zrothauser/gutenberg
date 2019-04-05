/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	IconButton,
	ExternalLink,
} from '@wordpress/components';
import {
	URLInput,
	URLPopover,
} from '@wordpress/block-editor';
import { prependHTTP, safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { useState } from '@wordpress/element';

const stopKeyPropagation = ( event ) => event.stopPropagation();

function LinkEditor( { url, onChange, onKeyDown, onSubmit, autocompleteRef } ) {
	return (
		// Disable reason: KeyPress must be suppressed so the block doesn't hide the toolbar
		/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
		<form
			className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
			onKeyPress={ stopKeyPropagation }
			onKeyDown={ onKeyDown }
			onSubmit={ ( event ) => {
				event.preventDefault();
				onSubmit();
			} }
		>
			<URLInput
				value={ url }
				onChange={ onChange }
				autocompleteRef={ autocompleteRef }
			/>
			<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
		</form>
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
	);
}

const LinkViewerURL = ( { url } ) => {
	if ( ! url ) {
		return null;
	}

	return (
		<ExternalLink
			href={ url }
			className="editor-format-toolbar__link-container-value block-editor-format-toolbar__link-container-value"
		>
			{ filterURLForDisplay( safeDecodeURI( url ) ) }
		</ExternalLink>
	);
};

const LinkViewer = ( { url, onEditLink } ) => {
	return (
		// Disable reason: KeyPress must be suppressed so the block doesn't hide the toolbar
		/* eslint-disable jsx-a11y/no-static-element-interactions */
		<div
			className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
			onKeyPress={ stopKeyPropagation }
		>
			<LinkViewerURL url={ prependHTTP( url ) } />
			<IconButton icon="edit" label={ __( 'Edit' ) } onClick={ onEditLink } />
		</div>
		/* eslint-enable jsx-a11y/no-static-element-interactions */
	);
};

export default function LinkPopover( { url, onSubmit, position, linkTarget, onToggleOpenInNewTab, onClose } ) {
	const [ editedURL, setEditedURL ] = useState( url || '' );
	const [ isShowingLinkEditor, setIsShowingLinkEditor ] = useState( url ? false : true );

	return (
		<URLPopover
			position={ position }
			onClose={ onClose }
			renderSettings={ () => (
				<ToggleControl
					label={ __( 'Open in New Tab' ) }
					onChange={ onToggleOpenInNewTab }
					checked={ linkTarget === '_blank' }
				/>
			) }
		>
			{ isShowingLinkEditor ? (
				<LinkEditor
					url={ editedURL || url }
					onChange={ ( value ) => {
						setEditedURL( value );
					} }
					onSubmit={ () => {
						onSubmit( editedURL );
						setIsShowingLinkEditor( false );
					} }
				/>
			) : (
				<LinkViewer
					url={ url }
					onEditLink={ () => setIsShowingLinkEditor( true ) }
				/>
			) }
		</URLPopover>
	);
}
