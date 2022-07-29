import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/Styles/colors';
import {Icon} from 'react-native-elements';
import {Dimensions} from 'react-native';

export default class PopUpInfo extends Component {
  state = {
    height: new Animated.Value(verticalScale(8.96)),
  };
  componentDidMount() {
    Animated.timing(this.state.height, {
      toValue: verticalScale(716.8),
      duration: 500,
      useNativeDriver: false,
    }).start();
    //console.log(this.state.height);
  }
  goDown() {
    Animated.timing(this.state.height, {
      toValue: verticalScale(8.96),
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      this.props.onBackdropPress();
    });
  }
  render() {
    return (
      // <Modal style={{ width: '90%'}} isVisible={true} onBackdropPress={() => this.props.onBackdropPress()}>
      <View
        style={{
          top: 0,
          left: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          alignItems: 'center',
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}>
        <Animated.View
          style={[localStyles.modalStyle, {height: this.state.height}]}>
          <View style={localStyles.topStyle}>
            <View style={{flex: 1}} />
            <Text style={localStyles.titleStyle}>{this.props.title}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableOpacity
                // style={{
                //   backgroundColor: colors.yellow,
                // }}
                onPress={() => {
                  //console.warn('AGGGGG');
                  this.goDown();
                }}>
                <Icon type="feather" name="x" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: colors.oyster,
              borderWidth: 2,
              borderColor: colors.white,
            }}>
            <Text>{this.props.content}</Text>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  modalStyle: {
    width: '95%',
    marginBottom: verticalScale(30),
  },
  topStyle: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 5,
    borderTopColor: colors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titleStyle: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
});
