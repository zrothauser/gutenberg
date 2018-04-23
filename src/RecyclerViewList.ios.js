import PropTypes from 'prop-types';
import React from 'react';
import ReactNative, {
  View,
  requireNativeComponent,
  UIManager
} from 'react-native';
import DataSource from './DataSource';

var RNReactNativeRecyclerviewList = requireNativeComponent('RNReactNativeRecyclerviewList', RecyclerViewList);

class RecyclerViewList extends React.Component {
  static propTypes = {
    ...View.propTypes,
    renderItem: PropTypes.func,// A funtion that defines how an item is rendered
    dataSource: PropTypes.instanceOf(DataSource),//A data source element that defines the number of elements on the list
    windowSize: PropTypes.number,
    initialListSize: PropTypes.number,
    initialScrollIndex: PropTypes.number,
    initialScrollOffset: PropTypes.number,
    itemAnimatorEnabled: PropTypes.bool
  };

  static defaultProps = {
    dataSource: new DataSource(),
    initialListSize: 10,
    windowSize: 30,
    itemAnimatorEnabled: true
  }

  _dataSourceListener = {
    onUnshift: () => {
      this._notifyItemRangeInserted(0, 1);
      this._shouldUpdateAll = true;
    },

    onPush: () => {
      const { dataSource } = this.props;
      this._notifyItemRangeInserted(dataSource.size(), 1);
      this._shouldUpdateAll = true;
    },

    onMoveUp: (position) => {
      this._notifyItemMoved(position, position - 1);
      this._shouldUpdateAll = true;
    },

    onMoveDown: (position) => {
      this._notifyItemMoved(position, position + 1);
      this._shouldUpdateAll = true;
    },

    onSplice: (start, deleteCount, ...items) => {
      if (deleteCount > 0) {
        this._notifyItemRangeRemoved(start, deleteCount);
      }
      if (items.length > 0) {
        this._notifyItemRangeInserted(start, items.length);
      }
      this._shouldUpdateAll = true;
    },

    onSet: (index, item) => {
      this._shouldUpdateKeys.push(this.props.dataSource.getKey(item, index));
      this.forceUpdate();
    },

    onSetDirty: () => {
      this._shouldUpdateAll = true;
      this.forceUpdate();
    }
  }

  constructor(props) {
    super(props);

    const {
      dataSource,
      initialListSize,
      initialScrollIndex
    } = this.props;

    dataSource._addListener(this._dataSourceListener);

    var visibleRange = initialScrollIndex >= 0 ?
    [initialScrollIndex, initialScrollIndex + initialListSize]
    : [0, initialListSize];

    this.state = {
    firstVisibleIndex: visibleRange[0],
    lastVisibleIndex: visibleRange[1],
    itemCount: dataSource.size()
    };

    this._shouldUpdateAll = true;
    this._shouldUpdateKeys = [];
  }

  componentWillMount() {
  }

  componentWillUnmount() {
    const { dataSource } = this.props;
    if (dataSource) {
        dataSource._removeListener(this._dataSourceListener);
    }
  }

  componentDidMount() {
    const { dataSource, initialScrollIndex, initialScrollOffset } = this.props;
    this._notifyDataSetChanged(dataSource.size());
    if (initialScrollIndex) {
        this.scrollToIndex({
        animated: false,
        index: initialScrollIndex,
        viewPosition: 0,
        viewOffset: initialScrollOffset
        });
    }

    this._shouldUpdateAll = false;
    this._shouldUpdateKeys = [];
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.props;
    if (nextProps.dataSource !== dataSource) {
      dataSource._removeListener(this._dataSourceListener);
      nextProps.dataSource._addListener(this._dataSourceListener);
      this._notifyDataSetChanged(nextProps.dataSource.size());
    }
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

  _notifyItemRangeInserted(position, count) {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.RNReactNativeRecyclerviewList.Commands.notifyItemRangeInserted,
      [position, count],
    );

    const { firstVisibleIndex, lastVisibleIndex, itemCount } = this.state;

    if (itemCount == 0) {
      this.setState({
                    itemCount: this.props.dataSource.size(),
                    firstVisibleIndex: 0,
                    lastVisibleIndex: this.props.initialListSize
                    });
    } else {
      if (position <= firstVisibleIndex) {
        this.setState({
                      firstVisibleIndex: this.state.firstVisibleIndex + count,
                      lastVisibleIndex: this.state.lastVisibleIndex + count,
                      });
      } else {
        this.forceUpdate();
      }
    }
  }

  _notifyDataSetChanged = (itemCount) => {
    UIManager.dispatchViewManagerCommand(
       ReactNative.findNodeHandle(this._nativeInstance),
       UIManager.RNReactNativeRecyclerviewList.Commands.notifyDataSetChanged,
       [itemCount]
    );
    this.setState({
                  itemCount
                  });
  }


}

module.exports = RecyclerViewList;
