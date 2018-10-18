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
	Fragment,
} from '@wordpress/element';
import { compose } from '@wordpress/compose';
import {
	Dashicon,
	IconButton,
	withFallbackStyles,
	ToggleControl,
} from '@wordpress/components';
import {
	URLInput,
	RichText,
	ContrastChecker,
	InspectorControls,
	withColors,
	PanelColorSettings,
} from '@wordpress/block-editor';

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

class ButtonEdit extends Component {
	constructor() {
		super( ...arguments );
		this.nodeRef = null;
		this.bindRef = this.bindRef.bind( this );
		this.toggleLinkSettingsVisibility = this.toggleLinkSettingsVisibility.bind( this );

		this.state = {
			settingsVisible: false,
		};
	}

	bindRef( node ) {
		if ( ! node ) {
			return;
		}
		this.nodeRef = node;
	}

	toggleLinkSettingsVisibility() {
		this.setState( ( state ) => ( { settingsVisible: ! state.settingsVisible } ) );
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
			isSelected,
			className,
		} = this.props;

		const {
			settingsVisible,
		} = this.state;

		const {
			text,
			url,
			title,
			linkTarget,
		} = attributes;

		return (
			<Fragment>
				<div className={ className } title={ title } ref={ this.bindRef }>
					<RichText
						placeholder={ __( 'Add text…' ) }
						value={ text }
						onChange={ ( value ) => setAttributes( { text: value } ) }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						className={ classnames(
							'wp-block-button__link', {
								'has-background': backgroundColor.color,
								[ backgroundColor.class ]: backgroundColor.class,
								'has-text-color': textColor.color,
								[ textColor.class ]: textColor.class,
							}
						) }
						style={ {
							backgroundColor: backgroundColor.color,
							color: textColor.color,
						} }
						keepPlaceholderOnFocus
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
					</InspectorControls>
				</div>
				{ isSelected && (
					<form
						className="block-library-button__inline-link"
						onSubmit={ ( event ) => event.preventDefault() }>
						<Dashicon icon="admin-links" />
						<URLInput
							value={ url }
							onChange={ ( value ) => setAttributes( { url: value } ) }
						/>
						<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
						<IconButton
							className="link-settings-toggle"
							icon="ellipsis"
							label={ __( 'Link Settings' ) }
							onClick={ this.toggleLinkSettingsVisibility }
							aria-expanded={ settingsVisible }
						/>
						{ settingsVisible && (
							<div className="link-settings">
								<ToggleControl
									label={ __( 'Open in New Tab' ) }
									onChange={ () => setAttributes( { linkTarget: ! linkTarget } ) }
									checked={ linkTarget } />
							</div>
						) }
					</form>
				) }
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	applyFallbackStyles,
] )( ButtonEdit );
