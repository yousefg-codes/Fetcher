import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Alert,
  Picker,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import CountryPicker, {DARK_THEME} from 'react-native-country-picker-modal';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';

//Optional Screen for giving your phone number
export default class Phone_Number extends Component {
  state = {
    phonenum: SignUpHandler.state.Phonenum,
    notFilled: SignUpHandler.state.Phonenum == '',
    clicked: false,
    country: SignUpHandler.state.countryAbbreviation,
    code: SignUpHandler.state.countryCode,
  };

  //Sends the Phone number to the Sign Up Class to store it and navigates to the Verification OR
  //PaymentCreds class depending on whether you choose to put a phone number
  CheckIfFull() {
    const {code, phonenum, country} = this.state;
    SignUpHandler.PhoneNumberhandler(phonenum, country, code);
    this.props.navigation.push(
      'PhoneNumberVerificationScreen',
      this.props.navigation.state.params,
    );
  }
  //When the flag is pressed the Modal opens up
  onPressFlag() {
    this.countryPicker.openModal();
  }
  //Selects the country and sets the state for it
  //when you open the modal
  selectCountry(value) {
    this.setState({country: value.cca2});
    this.setState({code: value.callingCode[0]}, () => {
      //console.log(this.state.country);
      //console.log(value);
    });
  }
  //Checks if all the TextInput fields are full in order to enable
  //the next-arrow button
  CheckText() {
    if (this.state.phonenum !== '') {
      this.setState({notFilled: false});
      return;
    }
    this.setState({notFilled: true});
  }
  render() {
    return (
      <View style={[styles.view, {flex: 3}]}>
        <Text style={styles.labelsbig}>Can I get your number?</Text>
        <Text style={styles.labelssmall}>
          You'll receive a texted code to verify this is your phone.
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              borderWidth: 1,
              width: 50,
              alignItems: 'center',
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
              height: 50,
              marginTop: 20,
              marginLeft: 10,
            }}>
            <View
              style={{marginTop: 10, alignItems: 'flex-end', marginLeft: 5}}>
              <CountryPicker
                filterable={true}
                countryCode={this.state.country}
                withEmoji
                translation="eng"
                onSelect={value => {
                  this.selectCountry(value);
                }}
              />
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
              marginTop: 20,
              borderColor: colors.black,
              paddingTop: 12,
              paddingBottom: 8,
            }}>
            <Text style={{fontFamily: 'Arial-BoldMT', fontSize: 20}}>
              {' '}
              +{this.state.code}{' '}
            </Text>
          </View>
          <TextInput
            placeholderTextColor={colors.lightGrey}
            defaultValue={this.state.phonenum}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            style={[
              styles.txtinput,
              {
                width: scale(414) - 100,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderRightWidth: 1,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                marginRight: 15,
              },
            ]}
            autoFocus={true}
            onFocus={() => this.setState({clicked: true})}
            onBlur={() => this.setState({clicked: false})}
            placeholder="Phone Number"
            onChangeText={input => {
              this.setState({phonenum: input}, () => this.CheckText());
            }}
          />
        </View>
        <ContinueArrows
          onPressBack={() =>
            SignUpHandler.PhoneNumberhandler(
              this.state.phonenum,
              this.state.country,
              this.state.code,
            )
          }
          onPress={() => this.CheckIfFull()}
          notFilled={this.state.notFilled}
        />
        <View style={{flexDirection: 'row-reverse'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.push('PaymentCreds', {isAddition: false});
            }}>
            <Text
              style={{
                marginRight: 15,
                fontFamily: 'Arial-BoldMT',
                fontSize: 15,
                textDecorationLine: 'underline',
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
