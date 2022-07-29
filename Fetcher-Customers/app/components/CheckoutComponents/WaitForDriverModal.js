import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import colors from '../../config/Styles/colors';
import {checkMark} from '../../config/Image Requires/imageImports';

export default class WaitForDriverModal extends Component {
  checkMarkWidth = new Animated.Value(scale(103.5));

  state = {
    isShowingDriverInfo: false,
    alreadySetReaction: false,
  };

  animateCheckMark() {
    Animated.timing(this.checkMarkWidth, {
      duration: 2000,
      useNativeDriver: false,
      toValue: scale(41.4),
    }).start();
  }

  render() {
    if (!this.props.isSearching && !this.state.alreadySetReaction) {
      this.setState({alreadySetReaction: true});
      this.animateCheckMark();
      setTimeout(() => {
        this.setState({isShowingDriverInfo: true});
        setTimeout(() => {
          this.props.hideComponent();
        }, 5000);
      }, 4000);
    }
    return (
      <Modal isVisible style={localStyles.modalStyle}>
        {this.props.isSearching ? (
          <View style={localStyles.containers}>
            <Text style={localStyles.waitingTextStyle}>
              Waiting For A Driver to Accept
            </Text>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : this.state.isShowingDriverInfo ? (
          <View style={localStyles.containers}>
            <Text style={localStyles.foundDriverText}>Driver Name: {this.props.driverInfo.driverData.name}</Text>
          </View>
        ) : (
          <View style={localStyles.containers}>
            <Animated.Image
              style={{
                height: verticalScale(62.72),
                width: this.checkMarkWidth,
                resizeMode: 'contain',
              }}
              source={checkMark}
            />
            <Text style={localStyles.foundDriverText}>Driver Found!</Text>
          </View>
        )}
      </Modal>
    );
  }
}
const localStyles = StyleSheet.create({
  modalStyle: {
    flex: 0,
    top: verticalScale(358.4),
    alignSelf: 'center',
    width: scale(289.8),
    height: verticalScale(179.2),
    borderWidth: 5,
    borderRadius: 15,
    borderColor: colors.black,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waitingTextStyle: {
    color: colors.black,
    marginBottom: 10,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(18),
  },
  foundDriverText: {
    color: colors.black,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(18),
  },
  containers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
