/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	Disabled,
	IconButton,
	PanelBody,
	SelectControl,
	TextControl,
	Toolbar,
	ToggleControl,
	withNotices,
} from '@wordpress/components';
import { Component, Fragment, createRef } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	mediaUpload,
} from '@wordpress/editor';
import { getBlobByURL, isBlobURL } from '@wordpress/blob';

/**
 * Internal dependencies
 */
import { createUpgradedEmbedBlock } from '../embed/util';

const ALLOWED_MEDIA_TYPES = [ 'video' ];
const VIDEO_POSTER_ALLOWED_MEDIA_TYPES = [ 'image' ];

class VideoEdit extends Component {
	constructor() {
		super( ...arguments );
		// edit component has its own src in the state so it can be edited
		// without setting the actual value outside of the edit UI
		this.state = {
			editing: ! this.props.attributes.src,
		};

		this.videoPlayer = createRef();
		this.posterImageButton = createRef();
		this.toggleAttribute = this.toggleAttribute.bind( this );
		this.addSource = this.addSource.bind( this );
		this.onSelectPoster = this.onSelectPoster.bind( this );
		this.onRemovePoster = this.onRemovePoster.bind( this );
	}

	componentDidMount() {
		const { attributes, noticeOperations, setAttributes } = this.props;
		const { id, src = '' } = attributes;
		if ( ! id && isBlobURL( src ) ) {
			const file = getBlobByURL( src );
			if ( file ) {
				mediaUpload( {
					filesList: [ file ],
					onFileChange: ( [ { url } ] ) => {
						setAttributes( { src: url } );
					},
					onError: ( message ) => {
						this.setState( { editing: true } );
						noticeOperations.createErrorNotice( message );
					},
					allowedTypes: ALLOWED_MEDIA_TYPES,
				} );
			}
		}
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.attributes.poster !== prevProps.attributes.poster ) {
			this.videoPlayer.current.load();
		}
	}

	toggleAttribute( attribute ) {
		return ( newValue ) => {
			this.props.setAttributes( { [ attribute ]: newValue } );
		};
	}

	onSelectURL( newSrc ) {
		const { attributes, setAttributes } = this.props;
		const { src } = attributes;

		// Set the block's src from the edit component's state, and switch off
		// the editing UI.
		if ( newSrc !== src ) {
			// Check if there's an embed block that handles this URL.
			const embedBlock = createUpgradedEmbedBlock(
				{ attributes: { url: newSrc } }
			);
			if ( undefined !== embedBlock ) {
				this.props.onReplace( embedBlock );
				return;
			}
			setAttributes( { src: newSrc, id: undefined } );
		}

		this.setState( { editing: false } );
	}

	setSubtitleAttributes( index, attributes ) {
		const { attributes: { subtitles }, setAttributes } = this.props;
		if ( ! subtitles[ index ] ) {
			return;
		}
		setAttributes( {
			subtitles: [
				...subtitles.slice( 0, index ),
				{
					...subtitles[ index ],
					...attributes,
				},
				...subtitles.slice( index + 1 ),
			],
		} );
	}

	addSubtitle() {
		const { attributes: { subtitles }, setAttributes } = this.props;
		setAttributes( {
			subtitles: [ ...subtitles, {} ],
		} );
	}

	removeSubtitle( index ) {
		const { attributes: { subtitles }, setAttributes } = this.props;
		const tempSubtitles = [ ...subtitles ];
		tempSubtitles.splice( index, 1 );
		setAttributes( {
			subtitles: tempSubtitles,
		} );
	}

	videoSourceTypeExists( type ) {
		return this.props.attributes.sources.find( ( source ) => type === source.type );
	}

	removeSource( url ) {
		const { setAttributes, attributes } = this.props;
		const filteredSources = attributes.sources.filter( ( source ) => source.url !== url );
		setAttributes( {
			sources: filteredSources,
		} );
	}

	addSource( media ) {
		const { setAttributes, attributes } = this.props;
		const type = media.mime || this.getVideoMimeType( media.url );
		setAttributes( {
			sources: [ ...attributes.sources, { src: media.url, type } ],
		} );
	}

	onSelectPoster( image ) {
		const { setAttributes } = this.props;
		setAttributes( { poster: image.url } );
	}

	onRemovePoster() {
		const { setAttributes } = this.props;
		setAttributes( { poster: '' } );

		// Move focus back to the Media Upload button.
		this.posterImageButton.current.focus();
	}

	render() {
		const {
			autoplay,
			caption,
			controls,
			loop,
			muted,
			poster,
			preload,
			sources,
			subtitles,
		} = this.props.attributes;
		const { setAttributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { editing } = this.state;
		const switchToEditing = () => {
			this.setState( { editing: true } );
		};
		const onSelectVideo = ( media ) => {
			if ( ! media || ! media.url ) {
				// in this case there was an error and we should continue in the editing state
				// previous attributes should be removed because they may be temporary blob urls
				setAttributes( { sources: [] } );
				return;
			}
			this.addSource( media );
		};

		if ( editing ) {
			return (
				<MediaPlaceholder
					icon="media-video"
					className={ className }
					onSelect={ onSelectVideo }
					onSelectURL={ this.addSource }
					accept="video/*"
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					value={ this.props.attributes }
					notices={ noticeUI }
					onError={ noticeOperations.createErrorNotice }
				/>
			);
		}

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<IconButton
							className="components-icon-button components-toolbar__control"
							label={ __( 'Edit video' ) }
							onClick={ switchToEditing }
							icon="edit"
						/>
					</Toolbar>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Video Settings' ) }>
						<ToggleControl
							label={ __( 'Autoplay' ) }
							onChange={ this.toggleAttribute( 'autoplay' ) }
							checked={ autoplay }
						/>
						<ToggleControl
							label={ __( 'Loop' ) }
							onChange={ this.toggleAttribute( 'loop' ) }
							checked={ loop }
						/>
						<ToggleControl
							label={ __( 'Muted' ) }
							onChange={ this.toggleAttribute( 'muted' ) }
							checked={ muted }
						/>
						<ToggleControl
							label={ __( 'Playback Controls' ) }
							onChange={ this.toggleAttribute( 'controls' ) }
							checked={ controls }
						/>
						<SelectControl
							label={ __( 'Preload' ) }
							value={ preload }
							onChange={ ( value ) => setAttributes( { preload: value } ) }
							options={ [
								{ value: 'auto', label: __( 'Auto' ) },
								{ value: 'metadata', label: __( 'Metadata' ) },
								{ value: 'none', label: __( 'None' ) },
							] }
						/>
						<MediaUploadCheck>
							<BaseControl
								className="editor-video-poster-control"
								label={ __( 'Poster Image' ) }
							>
								<MediaUpload
									title={ __( 'Select Poster Image' ) }
									onSelect={ this.onSelectPoster }
									allowedTypes={ VIDEO_POSTER_ALLOWED_MEDIA_TYPES }
									render={ ( { open } ) => (
										<Button
											isDefault
											onClick={ open }
											ref={ this.posterImageButton }
										>
											{ ! this.props.attributes.poster ? __( 'Select Poster Image' ) : __( 'Replace image' ) }
										</Button>
									) }
								/>
								{ !! this.props.attributes.poster &&
									<Button onClick={ this.onRemovePoster } isLink isDestructive>
										{ __( 'Remove Poster Image' ) }
									</Button>
								}
							</BaseControl>
						</MediaUploadCheck>
					</PanelBody>
					<PanelBody title={ __( 'Sources' ) }>
						{ sources.map( ( source ) => {
							return (
								<div key={ source.src }>
									<TextControl
										type="text"
										label={ source.type }
										value={ source.src }
										disabled
									/>
									<Button
										isLink
										className="is-destructive"
										onClick={ () => this.removeSource( source.src ) }
									>{ __( 'Remove video source' ) }</Button>
								</div>
							);
						} ) }
					</PanelBody>
				</InspectorControls>
				<figure className={ className }>
					{ /*
						Disable the video tag so the user clicking on it won't play the
						video when the controls are enabled.
					*/ }
					<Disabled>
						<video
							controls={ controls }
							loop={ loop }
							muted={ muted }
							poster={ poster }
						>
							{ sources.map( ( source ) => {
								return (
									<source
										key={ source.src }
										src={ source.src }
										type={ source.type }
									/>
								);
							} ) }

							{ subtitles.map( ( subtitle ) => {
								return (
									<track
										key={ subtitle.src }
										srcLang={ subtitle.srclang }
										label={ subtitle.label }
										kind={ subtitle.kind }
										src={ subtitle.src }
									/>
								);
							} ) }
						</video>
					</Disabled>
					{ ( ! RichText.isEmpty( caption ) || isSelected ) && (
						<RichText
							tagName="figcaption"
							placeholder={ __( 'Write caption…' ) }
							value={ caption }
							onChange={ ( value ) => setAttributes( { caption: value } ) }
							inlineToolbar
						/>
					) }
				</figure>
			</Fragment>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}

export default withNotices( VideoEdit );
