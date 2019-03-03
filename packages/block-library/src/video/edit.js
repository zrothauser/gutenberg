/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { getBlobByURL, isBlobURL } from '@wordpress/blob';
import {
	BaseControl,
	Button,
	Disabled,
	PanelBody,
	Modal,
	SelectControl,
	TextControl,
	ToggleControl,
	Toolbar, Dropdown, NavigableMenu, MenuItem,
	withNotices,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	mediaUpload,
} from '@wordpress/editor';
import { Component, Fragment, createRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { createUpgradedEmbedBlock } from '../embed/util';
import icon from './icon';

const ALLOWED_MEDIA_TYPES = [ 'video' ];
const VIDEO_POSTER_ALLOWED_MEDIA_TYPES = [ 'image' ];

const allowedVideoTypes = [
	{
		name: 'MP4',
		type: 'video/mp4',
	},
	{
		name: 'OGV',
		type: 'video/ogg',
	},
	{
		name: 'WebM',
		type: 'video/webm',
	},
];

class VideoEdit extends Component {
	constructor() {
		super( ...arguments );
		// edit component has its own src in the state so it can be edited
		// without setting the actual value outside of the edit UI
		this.state = {
			editing: ! this.props.attributes.src,
			modalContent: false,
			modalHeadline: '',
		};

		this.videoPlayer = createRef();
		this.posterImageButton = createRef();
		this.toggleAttribute = this.toggleAttribute.bind( this );
		this.addSource = this.addSource.bind( this );
		this.videoSourceTypeExists = this.videoSourceTypeExists.bind( this );
		this.onSelectPoster = this.onSelectPoster.bind( this );
		this.onRemovePoster = this.onRemovePoster.bind( this );
		this.setSubtitleAttributes = this.setSubtitleAttributes.bind( this );
		this.addSubtitle = this.addSubtitle.bind( this );
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

	addSubtitle( media ) {
		const { attributes: { subtitles }, setAttributes } = this.props;
		setAttributes( {
			subtitles: [ ...subtitles, { src: media.url, kind: 'subtitles' } ],
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

	removeSource( src ) {
		const { setAttributes, attributes } = this.props;
		const filteredSources = attributes.sources.filter( ( source ) => source.src !== src );
		setAttributes( {
			sources: filteredSources,
		} );
	}

	addSource( media ) {
		const { setAttributes, attributes } = this.props;
		const src = media.url !== undefined ? media.url : media;
		const type = media.mime || this.getVideoMimeType( src );
		setAttributes( {
			sources: [ ...attributes.sources, { src, type } ],
		} );
	}

	getVideoMimeType( url ) {
		const fileType = url.split( '.' ).pop();
		let mime = 'undefined';
		switch ( fileType ) {
			case 'mp4':
				mime = 'video/mp4';
				break;
			case 'webm':
				mime = 'video/webm';
				break;
			case 'ogv':
				mime = 'video/ogg';
				break;
		}
		return mime;
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
		const { availableLanguages, setAttributes, isSelected, className, noticeOperations, noticeUI } = this.props;
		const { modalHeadline, modalContent } = this.state;
		const onSelectVideo = ( media ) => {
			if ( ! media || ! media.url ) {
				// in this case there was an error and we should continue in the editing state
				// previous attributes should be removed because they may be temporary blob urls
				setAttributes( { sources: [] } );
				return;
			}
			this.addSource( media );
		};

		if ( ! sources.length ) {
			return (
				<MediaPlaceholder
					icon={ <BlockIcon icon={ icon } /> }
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

		const MyModal = (
			<div>
				{ modalContent && (
					<Modal
						title={ modalHeadline }
						onRequestClose={ () => this.setState( { modalContent: false } ) }
						shouldCloseOnClickOutside={ false }
					>
						{ modalContent === 'sources' && (
							<div>
								{
									<div>
										<p>{ __( 'Add alternate formats to ensure your video can be played on any browser or device.' ) }</p>
										{
											allowedVideoTypes.map( ( format ) => {
												return (
													<MediaUpload
														key={ format.type }
														title={ 'Add Video Source' }
														onSelect={ this.addSource }
														type={ format.type }
														render={ ( { open } ) => (
															<Button
																isDefault
																onClick={ open }
																disabled={ this.videoSourceTypeExists( format.type ) }
															>
																{ __( 'Add' ) } { format.name }
															</Button>
														) }
													/>
												);
											} )
										}
									</div>

								}

								{ sources.map( ( source ) => {
									return (
										<div key={ source.src }>
											{ source.src.substring( source.src.lastIndexOf( '/' ) + 1 ) }{ ' ' }
											<Button
												isLink
												className="is-destructive"
												onClick={ () => this.removeSource( source.src ) }
											>{ __( 'Remove video source' ) }</Button>
										</div>
									);
								} ) }

							</div>
						) }

						{ modalContent === 'tracks' && (
							<div>
								<p>{ __( 'Add tracks to your video to ensure everyone can understand your content.' ) }</p>
								{ subtitles.map( ( track, index ) => {
									return (
										<PanelBody key={ track.src } title={ track.src.substring( track.src.lastIndexOf( '/' ) + 1 ) } initialOpen={ false }>

											<SelectControl
												label={ __( 'Language' ) }
												value={ track.srclang }
												options={ availableLanguages }
												onChange={ ( newValue ) => {
													const label = availableLanguages.find( ( lang ) => lang.value === newValue ).label;
													return this.setSubtitleAttributes( index, { srclang: newValue, label } );
												} }
											/>
											{ track.srclang && (
												<div>
													<TextControl
														type="text"
														className="core-blocks-subtitle__srclang"
														label={ __( 'srclang' ) }
														value={ track.srclang }
														placeholder="en"
														help={ __( 'Valid BCP 47 language tag' ) }
														onChange={ ( newValue ) => this.setSubtitleAttributes( index, { srclang: newValue } ) }
													/>
													<TextControl
														type="text"
														className="core-blocks-subtitle__label"
														label={ __( 'Label' ) }
														value={ track.label }
														placeholder="English"
														onChange={ ( newValue ) => this.setSubtitleAttributes( index, { label: newValue } ) }
													/>
													<SelectControl
														label={ __( 'Kind' ) }
														value={ track.kind }
														options={ [
															{ value: 'subtitles', label: __( 'Subtitles' ) },
															{ value: 'captions', label: __( 'Captions' ) },
															{ value: 'descriptions', label: __( 'Descriptions' ) },
															{ value: 'chapters', label: __( 'Chapters' ) },
															{ value: 'metadata', label: __( 'Metadata' ) },
														] }
														onChange={ ( newValue ) => this.setSubtitleAttributes( index, { kind: newValue } ) }
													/>
												</div>
											) }
											<Button isLink className="is-destructive" onClick={ () => this.removeSubtitle( index ) }>Remove Video Track</Button>

										</PanelBody>
									);
								} ) }
								<MediaUpload
									title={ 'Add Subtitle' }
									onSelect={ this.addSubtitle }
									render={ ( { open } ) => (
										<Button
											isDefault
											onClick={ open }
										>
											{ __( 'Add Subtitle' ) }
										</Button>
									) }
								/>
							</div>
						) }
					</Modal>
				) }
			</div>
		);

		/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<Dropdown
							contentClassName="editor-block-settings-menu__popover"
							position="bottom right"
							renderToggle={ ( { onToggle, menuIsOpen } ) => {
								const toggleClassname = classnames( 'editor-block-settings-menu__toggle', {
									'is-opened': menuIsOpen,
								} );
								const label = menuIsOpen ? __( 'Hide video options' ) : __( 'More video options' );

								return (
									<Toolbar controls={ [ {
										icon: 'edit',
										title: label,
										onClick: () => {
											onToggle();
										},
										className: toggleClassname,
										extraProps: { 'aria-expanded': menuIsOpen },
									} ] } />
								);
							} }
							renderContent={ ( { } ) => (
								<NavigableMenu className="editor-block-settings-menu__content">
									<MenuItem
										className="editor-block-settings-menu__control"
										onClick={ () => this.setState( { modalContent: 'sources', modalHeadline: __( 'Format Settings' ) } ) }
										icon="media-video"
									>
										{ __( 'Edit formats' ) }
									</MenuItem>
									<MenuItem
										className="editor-block-settings-menu__control"
										onClick={ () => this.setState( { modalContent: 'tracks', modalHeadline: __( 'Track Settings' ) } ) }
										icon="admin-comments"
									>
										{ __( 'Edit Subtitles' ) }
									</MenuItem>

								</NavigableMenu>
							) }
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
							ref={ this.videoPlayer }
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
				{ MyModal }
			</Fragment>
		);
		/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
	}
}

export default compose( [
	withSelect( ( select ) => ( {
		availableLanguages: Object.values( select( 'core/block-editor' ).getEditorSettings().availableLanguages ),
	} ) ),
	withNotices,
] )( VideoEdit );
