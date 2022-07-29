import React, {Component} from 'react';
import {Animated, Text, TouchableOpacity} from 'react-native';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import styles from '../../config/Styles/ViewOrderInfoComponentStyle';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import {useNavigation, StackActions} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';

class ViewOrderInfoComponent extends Component {
  horizontalPosition = new Animated.Value(scale(546.48));

  state = {
    args: null,
    displayClickHereToViewOrderText: false,
  };

  animateOut = callBack => {
    Animated.timing(this.horizontalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: scale(341.52),
    }).start(callBack);
  };

  showSelf = args => {
    //console.log(args);
    this.setState({args}, () =>
      this.animateOut(() => {
        showMessage({
          message: 'Hint',
          description: 'To View Order Information, Press on the Orange Pop-up.',
          type: 'warning',
          duration: 4000,
          position: 'top',
        });
      }),
    );
  };
  showSelfNormal = args => {
    this.setState({args}, () => this.animateOut());
  };

  animateIn = callBack => {
    Animated.timing(this.horizontalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: scale(546.48),
    }).start(() => callBack());
  };

  render() {
    return (
      <Animated.View
        style={[styles.animatedContainer, {left: this.horizontalPosition}]}>
        <TouchableOpacity
          style={styles.clickToViewOrderBtn}
          onPress={() =>
            this.animateIn(() =>
              GlobalStateHandler.navigation.navigate('OrderInfoScreen', {
                orderDetails: this.state.args.orderDetails,
                orderID: this.state.args.orderID,
              }),
            )
          }
        />
      </Animated.View>
    );
  }
}

const displayClickHereToViewOrder = args => {
  GlobalStateHandler.viewOrderInfoRef.showSelf(args);
};

const displayClickHereToViewOrderNormal = args => {
  GlobalStateHandler.viewOrderInfoRef.showSelfNormal(args);
};

const hideViewOrderInfoButton = callBack => {
  GlobalStateHandler.viewOrderInfoRef.animateIn(() => callBack());
};

export {
  ViewOrderInfoComponent,
  displayClickHereToViewOrderNormal,
  hideViewOrderInfoButton,
  displayClickHereToViewOrder,
};
