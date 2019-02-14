/**
 * External dependencies
 */
import { Text, View, KeyboardAvoidingView, Platform, ScrollView, Keyboard, Dimensions, LayoutAnimation } from 'react-native';
import Modal from 'react-native-modal';
import SafeArea from 'react-native-safe-area';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import styles from './styles.scss';
import Button from './button';
import Cell from './cell';
import PickerCell from './picker-cell';
import { min } from 'moment';

class BottomSheet extends Component {
	constructor() {
		super( ...arguments );
		this.onSafeAreaInsetsUpdate = this.onSafeAreaInsetsUpdate.bind( this );
		this.onScrollViewSizeChange = this.onScrollViewSizeChange.bind( this );
		this.keyboardDidShow = this.keyboardDidShow.bind( this );
		this.keyboardDidHide = this.keyboardDidHide.bind( this );
		this.isAnimating = false;
		this.state = {
			safeAreaInset: {},
			contentHeight: 0,
			keyboardContentHeight: 0,
			isKeyboardShowing: false,
			viewportHeight: Dimensions.get('window').height,
		};

		SafeArea.getSafeAreaInsetsForRootView().then( this.onSafeAreaInsetsUpdate );
	}

	componentDidMount() {
		Keyboard.addListener( 'keyboardWillShow', this.keyboardDidShow );
		Keyboard.addListener( 'keyboardWillHide', this.keyboardDidHide );
		SafeArea.addEventListener( 'safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsUpdate );
	}

	componentWillUnmount() {
		Keyboard.removeListener( 'keyboardWillShow', this.keyboardDidShow );
		Keyboard.removeListener( 'keyboardWillHide', this.keyboardDidHide );
		SafeArea.removeEventListener( 'safeAreaInsetsForRootViewDidChange', this.onSafeAreaInsetsUpdate );
	}

	keyboardDidShow(event) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		this.setState({
			viewportHeight: event.endCoordinates.screenY - (this.state.safeAreaInset.top || 0),
			isKeyboardShowing: true,
		})
	}

	keyboardDidHide(event) {
		const { top, bottom } = this.state.safeAreaInset;
		const verticalSafeArea = top + bottom;
		this.setState({
			viewportHeight: Dimensions.get('window').height - (verticalSafeArea || 0),
			isKeyboardShowing: false,
		})
	}

	onSafeAreaInsetsUpdate( result ) {
		const { safeAreaInsets } = result;
		if ( this.state.safeAreaInset !== safeAreaInsets ) {
			this.setState( { safeAreaInsets: safeAreaInsets } );
		}
	}

	onScrollViewSizeChange(width, height) {
		this.setState({contentHeight: height});
	}

	render() {
		const { title = '', isVisible, leftButton, rightButton, hideHeader } = this.props;

		return (
			<Modal
				isVisible={ isVisible }
				style={ styles.bottomModal }
				animationInTiming={ 500 }
				animationOutTiming={ 500 }
				backdropTransitionInTiming={ 500 }
				backdropTransitionOutTiming={ 500 }
				backdropOpacity={ 0.2 }
				onBackdropPress={ this.props.onClose }
				onSwipe={ this.props.onClose }
				swipeDirection="down"
			>
				<KeyboardAvoidingView
					behavior={ Platform.OS === 'ios' && 'position' }
					style={ { height: Math.min(this.state.viewportHeight , this.state.contentHeight) } }
				>
					<ScrollView onContentSizeChange={ this.onScrollViewSizeChange } >
						<View style={ {...styles.content, borderColor: 'rgba(0, 0, 0, 0.1)'} }>
							<View style={ styles.dragIndicator } />
							{ this.props.children }
							<View style={ { height: this.state.safeAreaBottomInset } } />
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</Modal>

		);
	}
}

BottomSheet.Button = Button;
BottomSheet.Cell = Cell;
BottomSheet.PickerCell = PickerCell;

export default BottomSheet;
