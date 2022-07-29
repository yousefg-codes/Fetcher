import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Animated, Easing} from 'react-native';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import colors from '../../config/Styles/colors';

export default class AnAddressComponent extends Component {
  state = {
    Address: '',
  };
  static propTypes = {
    Address: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onPressDelete: PropTypes.func.isRequired,
    isNewAddress: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    mainAddress: PropTypes.bool.isRequired,
    onPressSetMain: PropTypes.func.isRequired,
  };
  animatedValue = new Animated.Value(0);
  shakingAnimation (){
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animatedValue, {toValue: 1.0, duration: 75, easing: Easing.linear, useNativeDriver: true}),
        Animated.timing(this.animatedValue, {toValue: -1.0, duration: 75, easing: Easing.linear, useNativeDriver: true}),
      ])
    ).start(); 
  }
  shakingReverseAnimation (){
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animatedValue, {toValue: -1.0, duration: 75, easing: Easing.linear, useNativeDriver: true}),
        Animated.timing(this.animatedValue, {toValue: 1.0, duration: 75, easing: Easing.linear, useNativeDriver: true})
      ])
    ).start(); 
  }
  componentDidUpdate(){
    if(this.props.isEditing && !this.props.mainAddress){
      if(this.props.number%2 === 0){
        //console.log('HI')
        this.shakingAnimation();
      }else{
        //console.log('Hello')
        this.shakingReverseAnimation();
      }
    }
  }
  componentDidMount() {
    this.setState({Address: this.props.Address});
  }
  render() {
    return (
      <View style={localStyles.addressComponentView}>
        <Animated.View
          style={this.props.isEditing ? {
            transform: [{
              rotate: this.animatedValue.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-0.015rad', '0.015rad']
              })
            }]
          } : {}}
          >
          <TouchableOpacity
            onPress={() => this.props.onPressSetMain()}
            style={[
              localStyles.accountSettings,
              {
                borderLeftColor: this.props.mainAddress 
                  ? colors.lightBlue
                  : colors.transparent,
                borderRightColor: colors.black,
                borderTopColor: colors.grey,
                borderBottomColor: colors.grey,
                backgroundColor: colors.black,
                height: verticalScale(74.67),
                overflow: 'hidden',
                width: this.props.isEditing ? (scale(403.65))-((scale(8.28))+(scale(59.14))) : scale(403.65),
              },
            ]}
            disabled={!this.props.isEditing || this.props.mainAddress}>
            <View style={{flexDirection: 'row', overflow: 'hidden'}}>
              <View
                style={[
                  localStyles.starView,
                  {
                    backgroundColor: this.props.mainAddress
                      ? colors.lightBlue
                      : colors.transparent,
                    // borderColor: this.props.mainAddress
                    //   ? colors.lightBlue
                    //   : colors.transparent, 
                  },
                ]}>
                <Icon
                  name="star"
                  color={
                    this.props.mainAddress
                      ? colors.black
                      : colors.transparent
                  }
                />
              </View>
              <Text
                style={[
                  localStyles.accountSettingsText,
                  {
                    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(15),
                    marginLeft: scale(21.12),
                  },
                ]}>
                {this.props.Address}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {this.props.isEditing ? (
          <View style={{flexDirection: 'row'}}>
            <View
              style={{width: scale(8.28), backgroundColor: colors.white}}
            />
            <View style={{width: scale(59.14), flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => this.props.onPressDelete()}
                style={[
                  localStyles.accountSettings,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: scale(26.91),
                    height: verticalScale(74.67),
                    flex: 3,
                  },
                ]}
                disabled={!this.props.isEditing}>
                {this.props.isEditing && !this.props.isNewAddress ? (
                  <Icon name="delete" size={moderateScale(30)} color="#ff0000" />
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  accountSettings: {
    width: scale(403.65),
    borderWidth: 1,
    height: verticalScale(58.24),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.black,
    alignSelf: 'center',
    backgroundColor: colors.black,
    marginBottom: 5,
  },
  accountSettingsText: {
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(20),
    marginTop: 10,
    width: '80%'
  },
  starView: {
    width: scale(51.75),
    height: verticalScale(81.45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressComponentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: verticalScale(99.56),
  },
});
