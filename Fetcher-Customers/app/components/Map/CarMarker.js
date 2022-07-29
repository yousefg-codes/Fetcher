import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {fetcherCar} from '../../config/Image Requires/imageImports';
import colors from '../../config/Styles/colors';

class CarMarker extends Component {
  render() {
    return (
      <Marker
        coordinate={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: 5 / 69,
          longitudeDelta: 5 / 69,
        }}
        style={localStyles.carMarkerStyle}>
        <Image
          style={[
            localStyles.carImage,
            {transform: [{rotate: 180 + this.props.heading + 'deg'}]},
          ]}
          source={fetcherCar}
        />
      </Marker>
    );
  }
}
const localStyles = StyleSheet.create({
  carImage: {
    resizeMode: 'contain',
    width: scale(41.4),
    height: verticalScale(40.32),
  },
  carMarkerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CarMarker;
