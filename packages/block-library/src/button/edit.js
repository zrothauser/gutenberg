/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Component,
	useCallback,
	useContext,
	useState,
} from '@wordpress/element';
import {
	compose,
	withInstanceId,
} from '@wordpress/compose';
import {
	BaseControl,
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	withFallbackStyles,
} from '@wordpress/components';
import {
	URLPopover,
	URLInput,
	RichText,
	ContrastChecker,
	InspectorControls,
	withColors,
	PanelColorSettings,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { ButtonEditSettings } from './edit-settings';

const { getComputedStyle } = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps;
	const backgroundColorValue = backgroundColor && backgroundColor.color;
	const textColorValue = textColor && textColor.color;
	//avoid the use of querySelector if textColor color is known and verify if node is available.
	const textNode = ! textColorValue && node ? node.querySelector( '[contenteditable="true"]' ) : null;
	return {
		fallbackBackgroundColor: backgroundColorValue || ! node ? undefined : getComputedStyle( node ).backgroundColor,
		fallbackTextColor: textColorValue || ! textNode ? undefined : getComputedStyle( textNode ).color,
	};
} );

const NEW_TAB_REL = 'noreferrer noopener';
const MIN_BORDER_RADIUS_VALUE = 0;
const MAX_BORDER_RADIUS_VALUE = 50;
const INITIAL_BORDER_RADIUS_POSITION = 5;

function BorderPanel( { borderRadius = '', setAttributes } ) {
	const setBorderRadius = useCallback(
		( newBorderRadius ) => {
			setAttributes( { borderRadius: newBorderRadius } );
		},
		[ setAttributes ]
	);
	return (
		<PanelBody title={ __( 'Border Settings' ) }>
			<RangeControl
				value={ borderRadius }
				label={ __( 'Border Radius' ) }
				min={ MIN_BORDER_RADIUS_VALUE }
				max={ MAX_BORDER_RADIUS_VALUE }
				initialPosition={ INITIAL_BORDER_RADIUS_POSITION }
				allowReset
				onChange={ setBorderRadius }
			/>
		</PanelBody>
	);
}
const InlineURLPicker = withInstanceId(
	function( { instanceId, isSelected, url, onChange } ) {
		const linkId = `wp-block-button__inline-link-${ instanceId }`;
		return (
			<BaseControl
				label={ __( 'Link' ) }
				className="wp-block-button__inline-link"
				id={ linkId }>
				<URLInput
					className="wp-block-button__inline-link-input"
					value={ url }
					/* eslint-disable jsx-a11y/no-autofocus */
					// Disable Reason: The rule is meant to prevent enabling auto-focus, not disabling it.
					autoFocus={ false }
					/* eslint-enable jsx-a11y/no-autofocus */
					onChange={ onChange }
					disableSuggestions={ ! isSelected }
					id={ linkId }
					isFullWidth
					hasBorder
				/>
			</BaseControl>
		);
	}
);

function PopoverURLPicker( { url, onChange } ) {
	const [ urlInput, setUrlInput ] = useState( url || '' );
	const [ isPopoverEnable, setIsPopoverEnable ] = useState( true );
	const onSubmit = useCallback(
		() => {
			onChange( urlInput );
			setIsPopoverEnable( false );
		},
		[ urlInput, onChange ]
	);
	if ( ! isPopoverEnable ) {
		return null;
	}
	return (
		<URLPopover focusOnMount={ false }>
			<URLPopover.LinkEditor
				className="editor-format-toolbar__link-container-content block-editor-format-toolbar__link-container-content"
				value={ urlInput }
				onChangeInputValue={ setUrlInput }
				onSubmit={ onSubmit }
			/>
		</URLPopover>
	);
}

function URLPicker( { isSelected, url, setAttributes } ) {
	const onChange = useCallback(
		( value ) => setAttributes( { url: value } ),
		[ setAttributes ]
	);
	const { urlInPopover } = useContext( ButtonEditSettings );
	if ( urlInPopover ) {
		return isSelected ? (
			<PopoverURLPicker
				url={ url }
				onChange={ onChange }
			/>
		) : null;
	}
	return (
		<InlineURLPicker
			url={ url }
			isSelected={ isSelected }
			onChange={ onChange }
		/>
	);
}

class ButtonEdit extends Component {
	constructor() {
		super( ...arguments );
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
		this.onSetLinkRel = this.onSetLinkRel.bind( this );
		this.onToggleOpenInNewTab = this.onToggleOpenInNewTab.bind( this );
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	onSetLinkRel( value ) {
		this.props.setAttributes( { rel: value } );
	}

	onToggleOpenInNewTab( value ) {
		const { rel } = this.props.attributes;
		const linkTarget = value ? '_blank' : undefined;

		let updatedRel = rel;
		if ( linkTarget && ! rel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! linkTarget && rel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		this.props.setAttributes( {
			linkTarget,
			rel: updatedRel,
		} );
	}

	render() {
		const {
			attributes,
			backgroundColor,
			textColor,
			setBackgroundColor,
			setTextColor,
			fallbackBackgroundColor,
			fallbackTextColor,
			setAttributes,
			className,
			isSelected,
		} = this.props;

		const {
			borderRadius,
			linkTarget,
			placeholder,
			rel,
			text,
			title,
			url,
		} = attributes;

		return (
			<div className={ className } title={ title } ref={ this.bindRef }>
				<RichText
					placeholder={ placeholder || __( 'Add text…' ) }
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
					withoutInteractiveFormatting
					className={ classnames(
						'wp-block-button__link', {
							'has-background': backgroundColor.color,
							[ backgroundColor.class ]: backgroundColor.class,
							'has-text-color': textColor.color,
							[ textColor.class ]: textColor.class,
							'no-border-radius': borderRadius === 0,
						}
					) }
					style={ {
						backgroundColor: backgroundColor.color,
						color: textColor.color,
						borderRadius: borderRadius ? borderRadius + 'px' : undefined,
					} }
				/>
				<URLPicker
					url={ url }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
				/>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								// Text is considered large if font size is greater or equal to 18pt or 24px,
								// currently that's not the case for button.
								isLargeText: false,
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackBackgroundColor,
								fallbackTextColor,
							} }
						/>
					</PanelColorSettings>
					<BorderPanel
						borderRadius={ borderRadius }
						setAttributes={ setAttributes }
					/>
					<PanelBody title={ __( 'Link settings' ) }>
						<ToggleControl
							label={ __( 'Open in new tab' ) }
							onChange={ this.onToggleOpenInNewTab }
							checked={ linkTarget === '_blank' }
						/>
						<TextControl
							label={ __( 'Link rel' ) }
							value={ rel || '' }
							onChange={ this.onSetLinkRel }
						/>
					</PanelBody>
				</InspectorControls>
			</div>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
] )( ButtonEdit );
