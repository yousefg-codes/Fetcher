import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {useState, Component} from 'react';
import {View, Animated, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from 'config/Styles/colors'
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';

class ConfirmItemsReceived extends Component {
  verticalPosition = new Animated.Value(
    verticalScale(940.8),
  );

  state = {
    orderId: '',
    index: -1
  } 

  animateOut = () => {
    Animated.timing(this.verticalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: verticalScale(816.2),
    }).start();
  };

  display = (orderId, index) => {
    this.setState({orderId, index}, () => {
        this.animateOut();
    })
  };

  animateIn = () => {
    Animated.timing(this.verticalPosition, {
      duration: 1000,
      useNativeDriver: false,
      toValue: verticalScale(940.8),
    }).start();
  };
  render() {
    return (
      <Animated.View
        style={[styles.animatedContainer, {bottom: this.verticalPosition}]}>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => FirebaseFunctions.confirmOrder(this.state.orderId)}>
            <Text style={styles.confirmAndRefuteText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refuteBtn}
            onPress={() => FirebaseFunctions.refuteOrder(this.state.orderId)}>
            <Text style={styles.confirmAndRefuteText}>Refute</Text>
          </TouchableOpacity>
        </View> */}
      </Animated.View>
    );
  }
}

const displayConfirm = (orderId, index) => {
  GlobalHandler.confirmOrderComponent.display(orderId, index);
};

export {ConfirmItemsReceived, displayConfirm};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    left: scale(10.35),
    alignSelf: 'center',
    height: verticalScale(44.8),
    width: scale(207),
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  infoContainer: {
    flex: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 10,
  },
  confirmBtn: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.green,
    marginRight: 5,
    backgroundColor: colors.green,
  },
  refuteBtn: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 7,
    marginRight: 10,
    borderColor: colors.red,
    backgroundColor: colors.red,
  },
  confirmAndRefuteText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(14),
  },
  infoText: {
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(14),
    color: colors.black,
    textAlign: 'center',
  },
  infoSubContainers: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
