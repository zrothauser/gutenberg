/**
* @format
* @flow
*/

import { Component } from '@wordpress/element';
import { View, KeyboardAvoidingView as AndroidKeyboardAvoidingView } from 'react-native';

const KeyboardAvoidingView = ( props ) => {
	return (
		<AndroidKeyboardAvoidingView { ...props } />
	);
};

export default KeyboardAvoidingView;
