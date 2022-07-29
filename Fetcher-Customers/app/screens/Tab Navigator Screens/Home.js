import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import Heading from '../../components/Global Components/Heading';
import SplashScreen from '../../components/Global Components/SplashScreen';
import Maps from '../../components/Map/Maps';
import {ProductItem} from '../../components/Global Components/ProductItem';
import stripe from 'tipsi-stripe';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import {STRIPE_PUB_KEY} from '../../../keys.js';

stripe.setOptions({
  publishableKey: STRIPE_PUB_KEY,
});

class Home extends Component {
  state = {
    isLoading: true,
    businessLocations: {},
    featuredProducts: [],
    personalProducts: [],
    drivers: [],
  };
  /* 
    This function will no longer be in use
    as nearby drivers will not be shown on the customer's map
    but when they make an order, the app will search for drivers 
    near the business
  */
  // setDrivers(index, driverData, docId) {
  //   let temp = this.state.drivers.slice();
  //   temp[index] = {driverData, docId};
  //   GlobalHandler.drivers = temp;
  //   this.setState({drivers: temp});
  // }
  async componentDidMount() {
    //console.warn(STRIPE_PUB_KEY)
    GlobalHandler.state.screens[0] = this;
    let simpleUserInfo = await FirebaseFunctions.getCurrentUserData(
      'commonData',
    );
    //console.log(simpleUserInfo)
    GlobalHandler.addSimpleUserInfo(simpleUserInfo);
    GlobalHandler.currentOrders = simpleUserInfo.currentOrders;
    let addresses = simpleUserInfo.addresses;
    let numDocs = addresses.length;
    let mainAddress = {};
    //console.log(addresses)
    for (var i = 0; i < numDocs; i++) {
      addresses[i].isMainAddress ? (mainAddress = addresses[i]) : null;
    }
    GlobalHandler.setMainAddress(mainAddress);
    // await FirebaseFunctions.listenForNearestDrivers(
    //   (index, driverData, docId) => this.setDrivers(index, driverData, docId),
    // );
    let locationData = await FirebaseFunctions.getAllBusinessLocsWhere();
    GlobalHandler.eventEmitter.addListener('updateProducts', async () => {
      let newProducts = GlobalHandler.getProducts();
      let newTempProducts = [];
      let newFeaturedProducts = [];
      for (var j = 0; j < newProducts.length; j++) {
        let item = newProducts[j];
        newTempProducts[j] = (
          <ProductItem
            key={j}
            addable
            numReviews={item.numReviews}
            businessId={item.businessId}
            isHorizontal
            navigation={this.props.navigation}
            itemId={item.itemId}
            businessName={item.businessName}
            imagePath={{
              uri: await FirebaseFunctions.getProductImg(
                item.businessId,
                item.itemId,
              ),
            }}
            inStock={item.inStock}
            name={item.name}
            rating={item.rating}
            location={item.businessName}
            cost={item.cost}
            categories={item.categories}
            description={item.description}
          />
        );
        if (j < 20) {
          newFeaturedProducts.push(newTempProducts[j]);
        }
      }
      this.setState({featuredProducts: newFeaturedProducts, isLoading: false});
    });
    for (var i = 0; i < locationData.docs.length; i++) {
      await FirebaseFunctions.getAllProductsInBusiness(
        locationData.docs[i].data().businessId,
      );
    }
    this.setState({
      businessLocations: locationData,
    });
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{backgroundColor: colors.white, flex: 1}}>
        <Heading navigation={this.props.navigation} defaultRow drawerNavigator>
          <Text style={localStyles.headingTxt}>Home</Text>
        </Heading>
        <ScrollView style={{flex: 1}}>
          <Text style={localStyles.miniHeaders}>Map</Text>
          <Maps
            drivers={this.state.drivers}
            navigation={this.props.navigation}
            businessLocations={this.state.businessLocations}
          />
          <Text style={localStyles.miniHeaders}>Featured</Text>
          <View style={localStyles.featuredProductsStyle}>
            {this.state.featuredProducts.length == 0 ? (
              <Text style={localStyles.noProductsTxt}>
                Unfortunately there are no businesses near you that cooperate
                with us, or they have not added products yet.
              </Text>
            ) : (
              this.state.featuredProducts
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
export default Home;
const localStyles = StyleSheet.create({
  headingStyle: {
    paddingTop: verticalScale(12.16),
    paddingBottom: verticalScale(12.16),
  },
  featuredProductsStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: scale(414),
  },
  noProductsTxt: {
    color: '#808080',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  headingTxt: {
    paddingTop: verticalScale(12.16),
    color: colors.white,
    paddingBottom: verticalScale(12.16),
    paddingLeft: scale(5.28),
    paddingRight: scale(5.28),
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(25),
  },
  miniHeaders: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    paddingBottom: verticalScale(12.16),
    paddingTop: verticalScale(12.16),
    paddingLeft: scale(10.56),
  },
  myProductsScrollView: {
    height: verticalScale(189.2),
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
});
