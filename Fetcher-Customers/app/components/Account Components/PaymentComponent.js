import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import colors from '../../config/Styles/colors';

export default class PaymentComponent extends Component {
  static propTypes = {
    Number: PropTypes.string.isRequired,
    onPressDelete: PropTypes.func.isRequired,
    onPressSetMain: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    typeOfPaymentIcon: PropTypes.string.isRequired,
  };
  render() {
    return (
      <TouchableOpacity
        disabled={!this.props.pressable}
        onPress={() => this.props.onPress()}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignContent: 'center',
          maxHeight: verticalScale(99.56),
        }}>
        <View
          style={[
            localStyles.accountSettings,
            {
              height: verticalScale(74.67),
              width: this.props.isEditing ? scale(331.2) : scale(414),
            },
            this.props.isChosen
              ? {
                  borderWidth: 5,
                  borderColor: colors.lightBlue,
                }
              : {
                  borderBottomColor: '#808080',
                  borderTopColor: '#808080',
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                },
          ]}
          disabled={!this.props.isEditing}>
          <View style={{flexDirection: 'row', marginLeft: 5}}>
            <FontAwesome5
              name={this.props.typeOfPaymentIcon}
              color="#fff"
              size={moderateScale(35)}
            />
            <Text
              style={[
                localStyles.accountSettingsText,
                {
                  fontFamily: 'Arial-BoldMT', fontSize: moderateScale(20),
                  marginLeft: scale(21.12),
                  width: scale(362.25),
                },
              ]}>
              {this.props.Number}
            </Text>
          </View>
        </View>
        {this.props.isEditing ? (
          <View style={{flex: scale(276), flexDirection: 'row'}}>
            <View
              style={{width: scale(24.84), backgroundColor: colors.white}}
            />
            <TouchableOpacity
              onPress={() => this.props.onPressDelete()}
              style={[
                localStyles.accountSettings,
                {
                  justifyContent: 'center',
                  width: scale(57.96),
                  height: verticalScale(74.67),
                  flex: scale(310.5),
                },
              ]}
              disabled={!this.props.isEditing}>
              {this.props.isEditing && !this.props.isNewAddress ? (
                <Icon name="delete" size={moderateScale(30)} color="#ff0000" />
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}
const localStyles = StyleSheet.create({
  accountSettings: {
    width: scale(414),
    height: verticalScale(59.73),
    backgroundColor: colors.black,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountSettingsText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(20),
  },
  starView: {
    width: scale(51.75),
    height: scale(51.75),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressComponentView: {
    flexDirection: 'row',
    alignContent: 'center',
    maxHeight: verticalScale(99.56),
  },
});
