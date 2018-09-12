/**
 * External dependencies
 */
import { BlackPortal, WhitePortal, PortalProvider } from 'react-native-portal';

 /**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';

export const createPortal = ( element, node ) => {
    const { name } = node;

    return (
        <BlackPortal name={ name }>
            { element }
        </BlackPortal>
    )
}

export const SlotContent = (props) => {
    const { name } = props;
    return (
        <WhitePortal name={ name }>
            { props.children }
        </WhitePortal>
    )
};

export const withPortalProvider = createHigherOrderComponent(
	( WrappedComponent ) => ( props ) => {
		return (
            <PortalProvider>
                <WrappedComponent { ...props } />
            </PortalProvider>
        );
	},
	'portalProvider'
);
