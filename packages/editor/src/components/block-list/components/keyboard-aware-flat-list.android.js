/**
* @format
* @flow
*/
import { Component } from '@wordpress/element';
import { FlatList } from 'react-native';
import KeyboardAvoidingView from './keyboard-avoiding-view';

export const KeyboardAwareFlatList = ( props: PropsType ) => {
	return (
		<KeyboardAvoidingView style={ { flex: 1 } }>
			<FlatList { ...props } />
		</KeyboardAvoidingView>
	);
};

export const handleCaretVerticalPositionChange = () => {
	//no need to handle on Android, it is system managed
};

export default { KeyboardAwareFlatList, handleCaretVerticalPositionChange };
