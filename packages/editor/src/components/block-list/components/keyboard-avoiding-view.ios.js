/**
* @format
* @flow
*/

import { Component } from '@wordpress/element';
import { View, KeyboardAvoidingView as IOSKeyboardAvoidingView, Dimensions } from 'react-native';

const KeyboardAvoidingView = ( propsType ) => {
	const { parentHeight, ...props } = propsType;
	const { height: fullHeight } = Dimensions.get( 'window' );
	const keyboardVerticalOffset = fullHeight - parentHeight;

	return (
		<IOSKeyboardAvoidingView { ...props } behavior={ 'padding' } keyboardVerticalOffset={ keyboardVerticalOffset } />
	);
};

export default KeyboardAvoidingView;
