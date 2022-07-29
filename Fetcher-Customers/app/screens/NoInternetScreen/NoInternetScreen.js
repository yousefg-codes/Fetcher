import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
} from 'react-native';
import colors from '../../config/Styles/colors';

export default class NoInternetScreen extends Component {
  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: colors.black,
          justifyContent: 'center',
        }}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.white,
            flex: 1,
            justifyContent: 'center',
          }}>
          {/* <Image
            style={{
              resizeMode: 'contain',
              width: scale(207),
              height: verticalScale(224),
            }}
            source={require('../../assets/dead-wifi.png')}
          /> */}
          <Text
            style={{
              color: colors.orange,
              textAlign: 'center',
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(18),
            }}>
            Uh Oh your internet's gone dead, once a connection has been
            established the app will reload
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
