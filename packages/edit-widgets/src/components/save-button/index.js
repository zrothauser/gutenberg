/**
 * External dependencies
 */
import { filter, map, some, forEach } from 'lodash';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

function SaveButton() {
	const { widgetAreaEdits, isSaving } = useSelect(
		( select ) => {
			const {
				hasEditsForEntityRecord,
				isSavingEntityRecord,
				getEntityRecords,
			} = select( 'core' );
			const widgetAreas = getEntityRecords( 'root', 'widgetArea' );
			const widgetAreaIds = map( widgetAreas, ( { id } ) => id );
			return {
				widgetAreaEdits: filter(
					widgetAreaIds,
					( id ) => hasEditsForEntityRecord( 'root', 'widgetArea', id )
				),
				isSaving: some(
					widgetAreaIds,
					( id ) => isSavingEntityRecord( 'root', 'widgetArea', id )
				),
			};
		}
	);
	const { saveEditedEntityRecord } = useDispatch( 'core' );
	//const { saveWidgetAreas } = useDispatch( 'core/edit-widgets' );
	const onClick = useCallback( () => {
		forEach( widgetAreaEdits, ( id ) => {
			saveEditedEntityRecord( 'root', 'widgetArea', id );
		} );
	}, [ widgetAreaEdits ] );

	return (
		<Button
			isPrimary
			isLarge
			isBusy={ isSaving }
			aria-disabled={ isSaving }
			onClick={ isSaving ? undefined : onClick }
			disabled={ widgetAreaEdits.length === 0 }
		>
			{ __( 'Update' ) }
		</Button>
	);
}

export default SaveButton;
