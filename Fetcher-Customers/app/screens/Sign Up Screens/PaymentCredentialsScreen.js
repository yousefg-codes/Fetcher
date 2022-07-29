import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import PaymentHandler from '../../config/Stripe/PaymentHandler';
import stripe from 'tipsi-stripe';
import {styles} from '../../config/Styles/globalStyles';
import ContinueArrows from '../../components/Global Components/ContinueArrows';
import SplashScreen from '../../components/Global Components/SplashScreen';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import {showMessage} from 'react-native-flash-message';
import Heading from '../../components/Global Components/Heading';
import {CustomPickerIcon} from '../../components/Global Components/CustomPicker';
import CheckBox from '@react-native-community/checkbox';
import colors from '../../config/Styles/colors';
import Strings from '../../config/Strings/Strings';
import PopUpInfo from '../../components/Account Components/PopUpInfo';
//Screen where you give your payment credentials
export default class PaymentCreds extends Component {
  state = {
    cardnum: SignUpHandler.state.cardnum,
    month: SignUpHandler.state.expiration.substring(
      0,
      SignUpHandler.state.expiration.indexOf('/'),
    ),
    year: SignUpHandler.state.expiration.substring(
      SignUpHandler.state.expiration.indexOf('/') + 1,
    ),
    years: [],
    months: [],
    previousCardnumLength: 0,
    notFilled:
      SignUpHandler.state.cardnum === '' ||
      SignUpHandler.state.expiration.substring(
        0,
        SignUpHandler.state.expiration.indexOf('/'),
      ) === 'MM' ||
      SignUpHandler.state.expiration.substring(
        SignUpHandler.state.expiration.indexOf('/') + 1,
      ) === 'YYYY',
    isLoading: false,
    inputs: [false, false, false, false, false],
    privacyPolicyAndTermsChecked: false,
    showingPopUp: false,
    popUpTitle: '',
    popUpBody: '',
  };
  componentDidMount() {
    var months = new Array(12);
    for (var i = 0; i < months.length; i++) {
      months[i] = i + 1;
    }
    var years = new Array(10);
    let currDate = new Date();
    for (var i = 0; i < years.length; i++) {
      years[i] = currDate.getFullYear() + i;
    }
    //console.log(years)
    this.setState({years, months});
  }
  async CheckIfFull() {
    const {cardnum} = this.state;
    if (!this.VerifyCard()) {
      showMessage({
        message: 'Invalid Card',
        description: 'Make sure the information entered is true',
        duration: 5000,
        position: 'top',
        type: 'danger',
      });
      return;
    }
    const {month, year} = this.state;
    if (this.props.navigation.state.params.isAddition) {
      this.setState({isLoading: true});
      let copyOfNum = '';
      let digitSections = this.state.cardnum.split(' ');
      for (let i = 0; i < digitSections.length; i++) {
        copyOfNum += digitSections[i];
      }
      console.log(copyOfNum);
      console.log(parseInt(month));
      console.log(parseInt(year));
      let tok = await stripe.createTokenWithCard({
        number: copyOfNum,
        expMonth: parseInt(month),
        expYear: parseInt(year),
      });
      let customerId = (await FirebaseFunctions.getCurrentUserData(
        'commonData',
      )).customerId;
      console.log(customerId);
      console.log(tok);
      await PaymentHandler.addNewCard(customerId, tok);
      //console.log('Hmm');
      this.setState({isLoading: true}, () =>
        this.props.navigation.push('PaymentOptionsScreen'),
      );
    } else {
      SignUpHandler.paymentCredsHandler(
        this.removeSpaces(cardnum),
        month + '/' + year,
      );
      this.props.navigation.push('Location', {addingAddress: false});
    }
  }
  removeSpaces(text) {
    let tempStr = '';
    let numbers = text.split(' ');
    numbers.forEach(element => (tempStr += element));
    return tempStr;
  }
  BtnColor(bool) {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  }
  VerifyCard() {
    var obj = require('card-validator');
    var cardnum = obj.number(this.state.cardnum);
    if (!cardnum.isPotentiallyValid) {
      return false;
    }
    if (cardnum.card) {
      return true;
    }
    return false;
  }
  Every4() {
    let cardnum = this.removeSpaces(this.state.cardnum);
    if (
      cardnum.length % 4 == 0 &&
      cardnum.length < 16 &&
      cardnum.length !== 0
    ) {
      this.setState({cardnum: this.state.cardnum + ' '});
    }
  }
  showPopUpWith(title, body) {
    this.setState({showingPopUp: true, popUpBody: body, popUpTitle: title});
  }
  fixEvery4() {
    const {cardnum} = this.state;
    let temp = cardnum;
    for (var i = 4; i < cardnum.length; i += 5) {
      if (cardnum.substring(i, i + 1) !== ' ') {
        temp = this.addSpaceAt(i, temp);
      }
    }
    this.setState({cardnum: temp});
  }
  addSpaceAt(index, str) {
    return str.substring(0, index) + ' ' + str.substring(index, str.length);
  }
  CheckText() {
    if (
      !(
        this.state.cardnum.length < 19 ||
        this.state.month === 'MM' ||
        this.state.year === 'YYYY' ||
        (!this.state.privacyPolicyAndTermsChecked &&
          !this.props.navigation.state.params.isAddition)
      )
    ) {
      this.setState({notFilled: false});
      return;
    }
    this.setState({notFilled: true});
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <ScrollView
          style={{
            width: scale(414),
            height: verticalScale(896),
          }}>
          <View style={styles.view}>
            {this.props.navigation.state.params.isAddition ? (
              <View>
                <Heading
                  style={{justifyContent: 'space-between'}}
                  navigation={this.props.navigation}
                />
                <Text style={[styles.labelsbig, {marginTop: 5}]}>
                  Please fill out the following information.
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.labelsbig}>Payment</Text>
                <Text style={styles.labelssmall}>
                  We need your payment credentials for future orders, and not
                  for anything else!
                </Text>
              </View>
            )}
            <TextInput
              placeholderTextColor={colors.lightGrey}
              defaultValue={this.state.cardnum}
              keyboardType="numeric"
              style={[
                styles.txtinput,
                {
                  fontFamily: 'Arial-BoldMT',
                  borderWidth: 1,
                  paddingLeft: 5,
                  borderColor: colors.black,
                  borderRadius: 5,
                  marginLeft: 10,
                },
              ]}
              label="Card Number"
              secureTextEntry={false}
              mode="outlined"
              placeholder="Card Number"
              onChangeText={i => {
                this.setState({cardnum: i.toString()}, () => {
                  let isDeleting = false;
                  if (this.state.previousCardnumLength > i.length) {
                    isDeleting = true;
                  }
                  if (!isDeleting) {
                    this.Every4();
                    this.fixEvery4();
                  }
                  this.CheckText();
                  this.setState({previousCardnumLength: i.length});
                });
              }}
              value={this.state.cardnum.value}
            />
          </View>
          <View style={{marginTop: 15, flexDirection: 'row', marginLeft: 10}}>
            <Text
              style={[
                localStyles.pickertxt,
                {
                  backgroundColor: colors.white,
                },
              ]}>
              {this.state.month}
            </Text>
            <Text
              style={{
                borderBottomWidth: 2,
                fontFamily: 'Arial-BoldMT',
                fontSize: 25,
                borderColor: colors.black,
                backgroundColor: this.state.showingPopUp
                  ? colors.grey
                  : colors.white,
              }}>
              /
            </Text>
            <Text
              style={[
                localStyles.pickertxt,
                {
                  backgroundColor: this.state.showingPopUp
                    ? colors.grey
                    : colors.white,
                },
              ]}>
              {this.state.year}
            </Text>
          </View>
          <View style={localStyles.pickerrender}>
            <CustomPickerIcon
              onChangeSelection={item => {
                this.setState({month: item}, () => this.CheckText());
              }}
              list={this.state.months}
              defaultIndex={
                this.state.month === 'MM' ? 0 : this.state.month - 1
              }
            />
            <CustomPickerIcon
              onChangeSelection={item => {
                this.setState({year: item}, () => this.CheckText());
              }}
              list={this.state.years}
              defaultIndex={
                this.state.year === 'YYYY'
                  ? 0
                  : this.state.years.indexOf(this.state.year)
              }
            />
          </View>
          {this.props.navigation.state.params.isAddition ? (
            <TouchableOpacity
              style={[
                styles.next2,
                {
                  marginLeft: 0,
                  borderColor: this.BtnColor(this.state.notFilled),
                  backgroundColor: this.BtnColor(this.state.notFilled),
                },
              ]}
              disabled={this.state.notFilled}
              onPress={() => this.CheckIfFull()}>
              <Text style={{color: colors.white}}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={{marginTop: 15}}>
              <View style={localStyles.termsAndPoliciesContainer}>
                <CheckBox
                  style={{color: colors.black}}
                  value={this.state.privacyPolicyAndTermsChecked}
                  onValueChange={val => {
                    this.setState({privacyPolicyAndTermsChecked: val}, () => {
                      this.CheckText();
                    });
                  }}
                />
                <Text style={localStyles.termsAndPrivacyNormalText}>
                  By Clicking this box you are agreeing to the
                  <Text
                    style={localStyles.termsAndPrivacyClickableText}
                    onPress={() =>
                      this.showPopUpWith(
                        'Privacy Policy',
                        Strings.privacyPolicy,
                      )
                    }>
                    {' '}
                    Privacy Policy{' '}
                  </Text>
                  and
                  <Text
                    style={localStyles.termsAndPrivacyClickableText}
                    onPress={() =>
                      this.showPopUpWith(
                        'Terms & Conditions',
                        Strings.termsAndConditions,
                      )
                    }>
                    {' '}
                    Terms & Conditions
                  </Text>
                  .
                </Text>
              </View>
              <ContinueArrows
                onPressBack={() =>
                  SignUpHandler.paymentCredsHandler(
                    this.state.cardnum,
                    this.state.month + '/' + this.state.year,
                  )
                }
                onPress={() => this.CheckIfFull()}
                notFilled={this.state.notFilled}
              />
            </View>
          )}
        </ScrollView>
        {this.state.showingPopUp ? (
          <PopUpInfo
            onBackdropPress={() => this.setState({showingPopUp: false})}
            content={this.state.popUpBody}
            title={this.state.popUpTitle}
          />
        ) : null}
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  picker: {},
  pickertxt: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 25,
    borderBottomWidth: 2,
    height: 30,
    backgroundColor: colors.white,
    borderColor: colors.black,
  },
  termsAndPoliciesContainer: {
    flexDirection: 'row',
    width: '90%',
    marginLeft: scale(10.56),
  },
  pickeritself: {
    width: scale(105.61),
    height: verticalScale(24.31),
  },
  termsAndPrivacyClickableText: {
    color: colors.lightBlue,
    fontSize: moderateScale(14),
    fontFamily: 'Arial-BoldMT',
  },
  termsAndPrivacyNormalText: {
    color: colors.black,
    fontSize: moderateScale(14),
    marginLeft: scale(10.56),
    fontFamily: 'Arial-BoldMT',
  },
  pickerits2: {
    width: scale(105.61),
    height: verticalScale(24.31),
  },
  pickerrender: {
    flexDirection: 'row',
    marginLeft: scale(10.56),
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: scale(276),
    height: verticalScale(44.8),
    borderColor: colors.black,
    marginTop: verticalScale(24.31),
  },
});
