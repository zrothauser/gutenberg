/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { TabPanel } from '@wordpress/components';
import { BlockNavigation } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import WordCount from '../word-count';
import DocumentOutline from '../document-outline';

function TableOfContentsPanel( { headingCount, paragraphCount, numberOfBlocks, hasOutlineItemsDisabled, onRequestClose } ) {
	return (
		<TabPanel
			className="table-of-contents__tab-panel"
			tabs={ [
				{
					name: 'document-outline',
					title: __( 'Document Outline' ),
				},
				{
					name: 'block-navigation',
					title: __( 'Block Navigation' ),
				},
			] }>
			{
				( tab ) => {
					if ( tab.name === 'document-outline' ) {
						return (
							<Fragment>
								<div
									className="table-of-contents__counts"
									role="note"
									aria-label={ __( 'Document Statistics' ) }
									tabIndex="0"
								>
									<div className="table-of-contents__count">
										{ __( 'Words' ) }
										<WordCount />
									</div>
									<div className="table-of-contents__count">
										{ __( 'Headings' ) }
										<span className="table-of-contents__number">
											{ headingCount }
										</span>
									</div>
									<div className="table-of-contents__count">
										{ __( 'Paragraphs' ) }
										<span className="table-of-contents__number">
											{ paragraphCount }
										</span>
									</div>
									<div className="table-of-contents__count">
										{ __( 'Blocks' ) }
										<span className="table-of-contents__number">
											{ numberOfBlocks }
										</span>
									</div>
								</div>

								{ headingCount > 0 && (
									<Fragment>
										<span className="table-of-contents__title">
											{ __( 'Document Outline' ) }
										</span>
										<DocumentOutline onSelect={ onRequestClose } hasOutlineItemsDisabled={ hasOutlineItemsDisabled } />
									</Fragment>
								) }
							</Fragment>
						);
					}

					return <BlockNavigation />;
				}
			}
		</TabPanel>
	);
}

export default withSelect( ( select ) => {
	const { getGlobalBlockCount } = select( 'core/block-editor' );
	return {
		headingCount: getGlobalBlockCount( 'core/heading' ),
		paragraphCount: getGlobalBlockCount( 'core/paragraph' ),
		numberOfBlocks: getGlobalBlockCount(),
	};
} )( TableOfContentsPanel );
