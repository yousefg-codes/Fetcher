import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PaymentComponent from '../../components/Account Components/PaymentComponent';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import PaymentHandler from '../../config/Stripe/PaymentHandler';
import SplashScreen from '../../components/Global Components/SplashScreen';
import colors from '../../config/Styles/colors';
import Heading from '../../components/Global Components/Heading';
import AnAddressComponent from '../../components/Account Components/AddressComponent';
import {ProductItem} from '../../components/Global Components/ProductItem';
import {styles} from '../../config/Styles/globalStyles';
import WaitForDriverModal from '../../components/CheckoutComponents/WaitForDriverModal';
import {showMessage} from 'react-native-flash-message';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
// import deviceInfoModule from 'react-native-device-info';

export default class ChooseOptionsScreen extends Component {
  state = {
    paymentMethods: [],
    isLoading: true,
    driverFound: false,
    waitingForDriver: false,
    mainAddressObj: null,
    driverInfo: {},
    deliveryFee: 0,
    businessLat: 0.0,
    businessLng: 0.0,
    chosenPaymentMethodIndex: -1,
    taxTotal: 0.0,
  };

  checkIfAnyDriverIsOnlineNotBusy() {
    for (var i = 0; i < GlobalHandler.drivers.length; i++) {
      if (
        GlobalHandler.drivers[i].driverData.isInDrivingSession &&
        GlobalHandler.drivers[i].driverData.currentOrders.length < 2
      ) {
        return true;
      }
    }
    return false;
  }
  onDriverAccept(driver) {
    //console.log(driver)
    this.setState({driverFound: true, driverInfo: driver});
  }
  onTotalRejection() {
    this.setState({waitingForDriver: false}, () => {
      showMessage({
        duration: 5000,
        position: 'top',
        type: 'danger',
        message: 'Uh Oh',
        description:
          'Unfortunately all the drivers near you rejected your request',
      });
    });
  }
  fixDate(dateString) {
    let nums = [];
    for (let i = 0; i < 2; i++) {
      nums.push(dateString.substring(0, dateString.indexOf('/')));
      dateString = dateString.substring(dateString.indexOf('/') + 1);
    }
    nums[2] = dateString;
    if (nums[0].substring(0, 1) === '0') {
      nums[0] = nums[0].substring(1);
    }
    if (nums[1].substring(0, 1) === '0') {
      nums[1] = nums[1].substring(1);
    }
    if (nums[2].length < 4) {
      nums[2] = '20' + nums[2];
    }
    return nums[0] + '/' + nums[1] + '/' + nums[2];
  }
  async placeOrder() {
    const {paymentMethods, chosenPaymentMethodIndex} = this.state;
    const availableDrivers = await FirebaseFunctions.findNearestDriversToBusiness(
      this.state.businessLat,
      this.state.businessLng,
    );
    if (availableDrivers.docs.length > 0) {
      let paymentMethod = await PaymentHandler.getCard(
        paymentMethods[chosenPaymentMethodIndex].id,
      );
      let currDate = new Date();
      let expirationMonth = paymentMethod.card.exp_month;
      let expirationYear = paymentMethod.card.exp_year;
      let cardIsGood;
      if (expirationYear < currDate.getFullYear()) {
        cardIsGood = false;
      } else if (expirationYear === currDate.getFullYear()) {
        if (expirationMonth < currDate.getMonth()) {
          cardIsGood = false;
        } else {
          cardIsGood = true;
        }
      } else {
        cardIsGood = true;
      }
      if (cardIsGood) {
        let firstBusinessId = this.props.navigation.state.params.items[0].item
          .businessId;
        let business = await FirebaseFunctions.getBusiness(firstBusinessId);
        if (!business.isOpen) {
          Alert.alert(
            'Uh Oh',
            'The business you would like to order from is currently closed',
          );
          return;
        }
        let correctDate = this.fixDate(new Date().toLocaleDateString('en-US'));
        this.setState({waitingForDriver: true}, async () => {
          await FirebaseFunctions.placeOrder(
            {
              date: correctDate,
              customerDeviceId: await FirebaseFunctions.messaging.getToken(),
              customerFirebaseId: FirebaseFunctions.currentUser.uid,
              items: this.props.navigation.state.params.items,
              customerName:
                GlobalHandler.state.simpleUserInfo.firstname +
                ' ' +
                GlobalHandler.state.simpleUserInfo.lastname,
              totalCost:
                Math.round(
                  (this.props.navigation.state.params.totalCost +
                    this.state.deliveryFee +
                    this.state.taxTotal) *
                    100,
                ) / 100,
              customerLocation: GlobalHandler.getMainAddress(),
              businessLocation: FirebaseFunctions.getBusinessLocation(
                this.props.navigation.state.params.items[0].item.businessId,
              ),
            },
            paymentMethods[chosenPaymentMethodIndex].id,
            driverInfo => this.onDriverAccept(driverInfo),
            () => this.onTotalRejection(),
          );
        });
      } else {
        showMessage({
          duration: 7000,
          position: 'top',
          type: 'danger',
          message: 'Hmm',
          description:
            'It appears that your card has expired, try using a different card, or renew your current card',
        });
      }
    } else {
      showMessage({
        duration: 7000,
        position: 'top',
        type: 'danger',
        message: 'Uh Oh',
        description:
          'Unfortunately there are either no Fetcher drivers near you, or they are all busy',
      });
    }
  }
  async componentDidMount() {
    let firstBusinessId = this.props.navigation.state.params.items[0].item
      .businessId;
    let userData = await FirebaseFunctions.getCurrentUserData('commonData');
    let addresses = userData.addresses;
    let mainAddressIndex = addresses.findIndex(element => {
      return element.isMainAddress;
    });
    //console.log(mainAddressIndex);
    let business = await FirebaseFunctions.getBusiness(firstBusinessId);
    let taxTotal = 0.0;
    for (let i = 0; i < this.props.navigation.state.params.items.length; i++) {
      console.log(this.props.navigation.state.params.items[i]);
      if (this.props.navigation.state.params.items[i].item.taxable) {
        taxTotal +=
          business.tax *
          this.props.navigation.state.params.items[i].item.cost *
          this.props.navigation.state.params.items[i].quantity;
      }
    }
    let deliveryFee =
      Math.round(
        (6.3 +
          (this.props.navigation.state.params.totalCost + 6 + taxTotal) /
            0.971 -
          (this.props.navigation.state.params.totalCost + 6 + taxTotal)) *
          100,
      ) / 100;
    let data = await PaymentHandler.getAllCards(userData.customerId);
    let businessLocation = await FirebaseFunctions.getBusinessLocation(
      this.props.navigation.state.params.items[0].item.businessId,
    );
    this.setState({
      paymentMethods: data.data,
      mainAddressObj: addresses[mainAddressIndex],
      isLoading: false,
      deliveryFee,
      businessLat: businessLocation.latitude,
      businessLng: businessLocation.longitude,
      taxTotal: Math.round(taxTotal * 100) / 100,
      chosenPaymentMethodIndex: data.data.length === 1 ? 0 : -1,
    });
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ScrollView style={{backgroundColor: colors.white}}>
          {this.state.waitingForDriver ? (
            <WaitForDriverModal
              hideComponent={() => {
                this.props.navigation.goBack(null);
                showMessage({
                  message: 'Order Info',
                  description: 'to track your order go to the orders screen',
                  type: 'success',
                  duration: 4000,
                });
                this.setState({waitingForDriver: false});
              }}
              driverInfo={this.state.driverInfo}
              isSearching={!this.state.driverFound}
            />
          ) : null}
          <Heading
            style={{justifyContent: 'space-between'}}
            navigation={this.props.navigation}
          />
          <View style={{marginTop: 10}}>
            {this.state.paymentMethods.length === 1 ? (
              <Text style={localStyles.headerTxt}>Payment method:</Text>
            ) : (
              <Text style={localStyles.headerTxt}>
                Choose a payment method:{' '}
              </Text>
            )}
            {this.state.paymentMethods.map((item, index, separators) => (
              <PaymentComponent
                onPress={() => {
                  this.setState({chosenPaymentMethodIndex: index});
                }}
                isChosen={this.state.chosenPaymentMethodIndex === index}
                pressable={
                  this.state.paymentMethods.length === 1 ? false : true
                }
                key={index}
                Number={'**** **** **** ' + item.card.last4}
                typeOfPaymentIcon="credit-card"
                isEditing={this.state.isEditing}
                onPressDelete={() => this.removeCard(index)}
              />
            ))}
          </View>
          <Text style={[localStyles.headerTxt, {marginTop: 5}]}>
            Main Address:{' '}
          </Text>
          <AnAddressComponent
            mainAddress={true}
            isNewAddress={false}
            isEditing={false}
            Address={this.state.mainAddressObj.location}
          />
          <Text style={[localStyles.headerTxt, {marginTop: 5}]}>Items: </Text>
          {this.props.navigation.state.params.items.map(
            (item, index, separators) => (
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  borderBottomWidth: 3,
                  borderBottomColor: colors.black,
                }}>
                <ProductItem
                  key={index}
                  addable
                  inStock={item.item.inStock}
                  isHorizontal
                  numReviews={item.item.numReviews}
                  businessName={item.item.businessName}
                  businessId={item.businessId}
                  navigation={this.props.navigation}
                  itemId={item.itemId}
                  imagePath={item.imagePath}
                  name={item.item.name}
                  rating={item.item.rating}
                  location={item.item.businessName}
                  cost={item.item.cost}
                  categories={item.item.categories}
                  description={item.item.description}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text style={localStyles.quantityText}>
                    quantity: {item.quantity}
                  </Text>
                  <Text style={localStyles.quantityText}>
                    cost per item: ${item.item.cost}
                  </Text>
                  <Text style={localStyles.quantityText}>
                    total cost: ${item.quantity * item.item.cost}
                  </Text>
                </View>
              </View>
            ),
          )}
          <Text style={localStyles.totalCostText}>
            Subtotal Cost: ${this.props.navigation.state.params.totalCost}
          </Text>
          <Text style={localStyles.totalCostText}>
            Delivery Fee: ${this.state.deliveryFee}
          </Text>
          <Text style={localStyles.totalCostText}>
            Tax: ${this.state.taxTotal}
          </Text>
          <Text style={localStyles.totalCostText}>
            Total Cost: $
            {Math.round(
              (this.props.navigation.state.params.totalCost +
                this.state.deliveryFee +
                this.state.taxTotal) *
                100,
            ) / 100}
          </Text>
          <TouchableOpacity
            onPress={async () => {
              if (this.state.chosenPaymentMethodIndex === -1) {
                Alert.alert(
                  'Uh Oh',
                  'You must choose a payment method before placing your order',
                );
              } else {
                await this.placeOrder();
              }
            }}
            style={[
              styles.next,
              {backgroundColor: colors.black, marginRight: 0},
            ]}>
            <Text
              style={{
                color: colors.white,
                fontFamily: 'Arial-BoldMT',
                fontSize: moderateScale(16),
              }}>
              Place Order
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  headerTxt: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    color: colors.black,
    marginLeft: 5,
    marginBottom: 5,
  },
  deliveryFeeContainer: {
    position: 'absolute',
    top: verticalScale(672),
    right: scale(255.3),
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
  },
  totalCostText: {
    marginTop: verticalScale(8.96),
    marginLeft: scale(8.28),
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
    marginBottom: 0,
  },
  quantityText: {
    textAlign: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(15),
    alignSelf: 'center',
    marginBottom: 5,
  },
});
