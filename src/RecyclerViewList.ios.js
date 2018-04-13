import PropTypes from 'prop-types';
import React from 'react';
import ReactNative, {
  requireNativeComponent,
  UIManager
} from 'react-native';
import DataSource from './DataSource';

var RNReactNativeRecyclerviewList = requireNativeComponent('RNReactNativeRecyclerviewList', RecyclerViewList);

class RecyclerViewList extends React.Component {
  static propTypes = {
    /**
     * A data source element that defines the number of elements on the list   
     */
    dataSource: PropTypes.instanceOf(DataSource),
  };

  static defaultProps = {
    dataSource: new DataSource()
  }

  render() {
    return <RNReactNativeRecyclerviewList {...this.props} 
      ref={(component) => this._nativeInstance = component }
    />;
  }

  scrollToEnd({ animated = true, velocity } = {}) {
    this.scrollToIndex({
      index: this.props.dataSource.size() - 1,
      animated,
      velocity
    });
  }

  scrollToIndex = ({ animated = true, index, velocity, viewPosition, viewOffset }) => {    
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this._nativeInstance),
      UIManager.RNReactNativeRecyclerviewList.Commands.scrollToIndex,
      [index, animated]
    );
  }

}

module.exports = RecyclerViewList;