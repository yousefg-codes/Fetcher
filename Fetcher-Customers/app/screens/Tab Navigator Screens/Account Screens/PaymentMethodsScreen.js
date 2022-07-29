import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FirebaseFunctions from '../../../config/Firebase/FirebaseFunctions';
import {styles} from '../../../config/Styles/globalStyles.js';
import SplashScreen from '../../../components/Global Components/SplashScreen';
import {Icon} from 'react-native-elements';
import Heading from '../../../components/Global Components/Heading';
import PaymentHandler from '../../../config/Stripe/PaymentHandler';
import {FlatList} from 'react-native-gesture-handler';
import PaymentComponent from '../../../components/Account Components/PaymentComponent';
import {showMessage} from 'react-native-flash-message';

export default class PaymentOptionsScreen extends Component {
  state = {
    isEditing: false,
    isLoading: true,
    arrData: [],
  };
  async componentDidMount() {
    let data = await PaymentHandler.getAllCards(
      (await FirebaseFunctions.getCurrentUserData('commonData')).customerId,
    );
    this.setState({arrData: data.data, isLoading: false});
  }
  checkBeforeLeaving() {
    this.props.navigation.navigate('Account');
  }
  async removeCard(index) {
    let tempData = [];
    let factor = 0;
    if (this.state.arrData.length !== 1) {
      let toBeRemovedId = this.state.arrData[index].id;
      //console.log('BEFORE: ' + tempData);
      for (let i = 0; i < this.state.arrData.length; i++) {
        if (i != index) {
          tempData[i + factor] = this.state.arrData[i];
        } else {
          factor = -1;
        }
      }
      this.setState({arrData: tempData});
      await PaymentHandler.removeCard(toBeRemovedId);
    } else {
      showMessage({
        message: 'Uh Oh',
        description:
          'Sorrry, but you need to create another payment method before deleting this one',
        duration: 5000,
        position: 'top',
        type: 'danger',
      });
    }
  }
  changeEdit() {
    this.setState({isEditing: !this.state.isEditing});
  }
  createNewPaymentMethod() {
    this.props.navigation.push('PaymentCreds', {isAddition: true});
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View
        style={{
          width: scale(414),
          height: verticalScale(896),
          backgroundColor: colors.white,
        }}>
        <View style={{height: verticalScale(89.6)}}>
          <Heading
            defaultRow
            onPress={() => this.checkBeforeLeaving()}
            navigation={this.props.navigation}
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <TouchableOpacity
              style={[
                styles.next,
                {
                  paddingLeft: scale(31.85),
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingRight: scale(31.85),
                  height: verticalScale(35.84),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: this.state.isEditing
                    ? '#ff0000'
                    : colors.white,
                  borderColor: this.state.isEditing ? '#ff0000' : colors.white,
                  marginRight: scale(10.56),
                },
              ]}
              onPress={() => this.changeEdit()}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: 'Arial-BoldMT',
                  fontSize: moderateScale(18),
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </Heading>
        </View>
        <View style={{height: verticalScale(59.73)}} />
        <View
          style={{
            height: verticalScale((this.state.arrData.length * 896) / 8),
          }}>
          <FlatList
            data={this.state.arrData}
            renderItem={({item, index, separators}) => (
              <PaymentComponent
                key={index}
                Number={'**** **** **** ' + item.card.last4}
                typeOfPaymentIcon="credit-card"
                isEditing={this.state.isEditing}
                onPressSetMain={() => {}}
                mainPaymentMethod
                onPressDelete={() => this.removeCard(index)}
              />
            )}
          />
        </View>
        <View style={{height: verticalScale(35.84)}}>
          {this.state.isEditing ? (
            <TouchableOpacity
              onPress={() => {
                this.createNewPaymentMethod();
              }}>
              <Icon name="add-circle" style={{color: '#0000ff'}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  userImage: {
    width: moderateScale(110),
    transform: [{translateX: -1}, {translateY: 1}],
    height: moderateScale(110),
    alignSelf: 'center',
    borderRadius: moderateScale(55),
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  userName: {
    color: colors.black,
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    marginLeft: scale(31.85),
  },
  accountSettings: {
    width: scale(414),
    height: verticalScale(59.73),
    backgroundColor: colors.black,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#808080',
    borderTopColor: '#808080',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  accountSettingsText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
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
