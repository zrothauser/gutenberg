/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	ToggleControl,
	IconButton,
	ExternalLink,
	BaseControl,
} from '@wordpress/components';
import {
	URLInput,
} from '@wordpress/block-editor';
import { prependHTTP, safeDecodeURI, filterURLForDisplay } from '@wordpress/url';
import { useState } from '@wordpress/element';

function LinkEditor( { url, onChange, onSubmit, autocompleteRef } ) {
	return (
		<form
			className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
			onSubmit={ ( event ) => {
				event.preventDefault();
				onSubmit();
			} }
		>
			<BaseControl label={ __( 'Link' ) }>
				<URLInput
					/* eslint-disable-next-line jsx-a11y/no-autofocus */
					autoFocus={ false }
					value={ url }
					onChange={ onChange }
					autocompleteRef={ autocompleteRef }
				/>
			</BaseControl>
		</form>
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
		<div
			className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
		>
			<LinkViewerURL url={ prependHTTP( url ) } />
			<IconButton icon="edit" label={ __( 'Edit' ) } onClick={ onEditLink } />
		</div>
	);
};

const URLInline = ( { children, renderSettings } ) => {
	const [ isSettingsExpanded, setIsSettingsExpanded ] = useState( false );

	return (
		<div className="block-editor-url-popover block-editor-url-inline">
			<div className="editor-url-popover__row block-editor-url-popover__row">
				{ children }
				{ !! renderSettings && (
					<IconButton
						className="editor-url-popover__settings-toggle block-editor-url-popover__settings-toggle"
						icon="arrow-down-alt2"
						label={ __( 'Link Settings' ) }
						onClick={ () => setIsSettingsExpanded( ! isSettingsExpanded ) }
						aria-expanded={ isSettingsExpanded }
					/>
				) }
			</div>
			{ isSettingsExpanded && !! renderSettings && (
				<div className="editor-url-popover__row block-editor-url-popover__row editor-url-popover__settings block-editor-url-popover__settings">
					{ renderSettings() }
				</div>
			) }
		</div>
	);
};

export default function LinkThing( { url, onSubmit, linkTarget, onToggleOpenInNewTab } ) {
	const [ editedURL, setEditedURL ] = useState( url || '' );

	return (
		<URLInline
			renderSettings={ () => (
				<ToggleControl
					label={ __( 'Open in New Tab' ) }
					onChange={ onToggleOpenInNewTab }
					checked={ linkTarget === '_blank' }
				/>
			) }
		>
			<LinkEditor
				url={ editedURL || url }
				onChange={ ( value ) => {
					setEditedURL( value );
				} }
				onSubmit={ () => {
					onSubmit( editedURL );
				} }
			/>
		</URLInline>
	);
}
