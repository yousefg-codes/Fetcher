import React, {useState, Component} from 'react';
import {
  View,
  Animated,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import styles from '../../config/Styles/AwaitingOrderComponentStyle';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import colors from '../../config/Styles/colors';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
class AwaitingOrderComponent extends Component {
  state = {
    animate: false,
    verticalPosition: new Animated.Value(verticalScale(896)),
  };

  // isNotchedIphone = () => {
  //   return (
  //     (width === X_WIDTH && height === X_HEIGHT) ||
  //     (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
  //   );
  // };

  animateOut = () => {
    Animated.timing(this.state.verticalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: Dimensions.get('window').height - verticalScale(76.16),
    }).start();
  };

  showAwaiting = () => {
    this.animateOut();
  };

  animateIn = () => {
    Animated.timing(this.state.verticalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: Dimensions.get('window').height + verticalScale(76.16),
    }).start();
  };
  componentDidMount() {
    //console.warn(this.state.verticalPosition);
    console.warn(StatusBar.currentHeight);
  }
  render() {
    return (
      <Animated.View
        style={[
          styles.animatedContainer,
          {bottom: this.state.verticalPosition},
        ]}>
        <Text style={styles.waitingText}>Awaiting customer request</Text>
        <ActivityIndicator
          animating={this.state.animate}
          size="small"
          color={colors.orange}
        />
      </Animated.View>
    );
  }
}

const displayAwaitingOrder = () => {
  GlobalStateHandler.newAwaitingOrderComponentRef.showAwaiting();
  GlobalStateHandler.newAwaitingOrderComponentRef.setState({animate: true});
};

const hideAwaitingOrder = () => {
  GlobalStateHandler.newAwaitingOrderComponentRef.animateIn();
  GlobalStateHandler.newAwaitingOrderComponentRef.setState({animate: false});
};
export {AwaitingOrderComponent, displayAwaitingOrder, hideAwaitingOrder};
