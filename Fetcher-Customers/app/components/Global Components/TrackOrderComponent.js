import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import colors from '../../config/Styles/colors';
import {Icon} from 'react-native-elements';

export default class TrackOrderComponent extends Component {
  render() {
    return (
      <TouchableOpacity style={localStyles.containerButton} onPress={() => {
        const {businessLocation, driver} = this.props;
        this.props.navigation.push('TrackOrderScreen', {businessLocation, driver})
      }}>
        <View
          style={{
            justifyContent: 'space-evenly',
            height: '100%',
          }}>
          <Text style={localStyles.trackOrderText}>Track your Order</Text>
          <Text style={localStyles.orderInfoText}>
            Number of Items: {this.props.numItems}
          </Text>
          <Text style={localStyles.orderInfoText}>
            Business: {this.props.businessName}
          </Text>
          <Text style={localStyles.orderInfoText}>
            Driver: {this.props.driver.driverData.name}
          </Text>
        </View>
        <Icon
          name="ios-arrow-forward"
          type="ionicon"
          style={{marginRight: scale(82.8)}}
          color={colors.white}
        />
      </TouchableOpacity>
    );
  }
}
const localStyles = StyleSheet.create({
  containerButton: {
    backgroundColor: colors.skyBlue,
    width: scale(403.65),
    alignSelf: 'center',
    height: verticalScale(125.44),
    marginTop: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.skyBlue,
  },
  trackOrderText: {
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(22),
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 2,
  },
  orderInfoText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
    marginBottom: 3,
  },
});
