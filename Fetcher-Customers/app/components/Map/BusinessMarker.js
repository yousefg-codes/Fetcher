import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import SplashScreen from '../Global Components/SplashScreen';

class BusinessMarker extends Component {
  render() {
    const {content} = this.props;
    var str = content;
    return (
      <Marker
        onPress={() => {
          this.props.navigation.push('BusinessProducts', {
            businessId: this.props.businessId,
          });
        }}
        style={{alignItems: 'center'}}
        coordinate={this.props.coordinate}>
        <View style={localStyles.marker}>
          <Image style={localStyles.img} source={this.props.businessLogo} />
        </View>
        <View style={localStyles.triangleView} />
      </Marker>
    );
  }
}
const localStyles = StyleSheet.create({
  img: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  triangleView: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
  },
  marker: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: colors.white,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
});
export default BusinessMarker;
