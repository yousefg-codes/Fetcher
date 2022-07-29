import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import Heading from '../../components/Global Components/Heading';
import {styles} from '../../config/Styles/globalStyles';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import SplashScreen from '../../components/Global Components/SplashScreen';
import {ProductItem} from '../../components/Global Components/ProductItem';
import colors from '../../config/Styles/colors';
import {FlatList} from 'react-native-gesture-handler';
import {CustomPickerIcon} from '../../components/Global Components/CustomPicker';
import {color, cos} from 'react-native-reanimated';

export default class Cart extends Component {
  state = {
    isLoading: true,
    possibleQuantities: [],
    fullCartItems: [],
    totalCost: 0,
  };
  async quantityChanged(index, value) {
    const {fullCartItems, totalCost} = this.state;
    let copy = fullCartItems.slice();
    if (copy[index].quantity === value) {
      return;
    }
    this.setState({
      totalCost:
        totalCost -
        fullCartItems[index].quantity * fullCartItems[index].item.cost +
        value * fullCartItems[index].item.cost,
    });
    copy[index].quantity = value;
    this.setState({
      fullCartItems: copy,
    });
    let cartRepresentation = this.getCartArray(copy);
    await FirebaseFunctions.editCart(cartRepresentation);
  }
  getCartArray(fullCartItems) {
    let temp = [];
    for (var i = 0; i < fullCartItems.length; i++) {
      temp.push({
        itemId: fullCartItems[i].itemId,
        quantity: fullCartItems[i].quantity,
      });
    }
    return temp;
  }
  async removeFromCart(j) {
    let arr = this.state.fullCartItems;
    arr.splice(j, 1);
    this.setState({isLoading: true});
    await FirebaseFunctions.editCart(arr);
    this.setState(
      {itemReferences: arr},
      async () => await this.componentDidMount(),
    );
  }
  async moveToCheckout() {
    let isOneProductWrong = false;
    let isOneProductNotHere = true;
    let productOutOfStock = false;
    let firstBusinessId = this.state.fullCartItems[0].item.businessId;
    //console.warn(this.state.fullCartItems.length);
    let existsArr = [];
    if (this.state.totalCost < 10) {
      Alert.alert('Uh Oh', 'You can only make orders that are $10 or more');
      return;
    }
    //console.log('safe');
    for (let i = 0; i < this.state.fullCartItems.length; i++) {
      console.warn(this.state.fullCartItems[i].itemId);
      existsArr.push(
        !(await FirebaseFunctions.getProduct(
          this.state.fullCartItems[i].itemId,
        )).exists,
      );
    }
    //console.log('safe2');
    let j = 0;
    console.warn(existsArr[0]);
    this.state.fullCartItems.forEach(element => {
      if (existsArr[j]) {
        Alert.alert(
          'Uh Oh',
          'It appears that ' +
            element.item.name +
            ' has been deleted by its business, please delete it from your cart',
        );
        productOutOfStock = true;
      }
      if (!element.item.inStock) {
        Alert.alert(
          'Uh Oh',
          'You cannot purchase an item that is currently out of stock',
        );
        productOutOfStock = true;
      }
      if (element.item.businessId !== firstBusinessId) {
        Alert.alert(
          'Uh Oh',
          'Sorry but for now you can only order products from one business',
        );
        isOneProductWrong = true;
      } else {
        for (var i = 0; i < GlobalHandler.state.businessLocations.length; i++) {
          console.log('HERE');
          console.log(element.item.businessId);
          console.log(GlobalHandler.state.businessLocations[i].businessId);
          if (
            GlobalHandler.state.businessLocations[i].businessId ===
            element.item.businessId
          ) {
            isOneProductNotHere = false;
          }
        }
      }
      j++;
    });
    console.log(isOneProductNotHere);
    if (isOneProductNotHere) {
      Alert.alert(
        'Uh Oh',
        "Some of your products are from a business that isn't near you",
      );
      isOneProductWrong = true;
    }
    if (isOneProductWrong || isOneProductNotHere || productOutOfStock) {
      return;
    }
    if (
      this.state.fullCartItems.length === 1 &&
      this.state.fullCartItems[0].quantity === 1
    ) {
      Alert.alert(
        'Hmm...',
        'Are you sure you want to purchase only one item?',
        [
          {
            text: 'Yes',
            onPress: () => {
              this.props.navigation.push('ChooseOptionsScreen', {
                items: this.state.fullCartItems,
                totalCost: this.state.totalCost,
              });
            },
          },
          {text: 'No'},
        ],
      );
      return;
    }
    this.props.navigation.push('ChooseOptionsScreen', {
      items: this.state.fullCartItems,
      totalCost: this.state.totalCost,
    });
  }
  async componentDidMount() {
    GlobalHandler.state.screens[2] = this;
    let items = await FirebaseFunctions.getCurrentUserData('cart');
    let tempFullCartItems = [];
    let tempQuanitities = [];
    for (var i = 1; i <= 20; i++) {
      tempQuanitities[i - 1] = i;
    }
    this.setState(
      {
        itemReferences: items.items,
        possibleQuantities: tempQuanitities,
      },
      async () => {
        let totalCost = 0;
        for (var i = 0; i < items.items.length; i++) {
          let item = await (await FirebaseFunctions.getProduct(
            items.items[i].itemId,
          )).data();
          //console.warn(item);
          // FirebaseFunctions.listenOnProduct(
          //   items.items[i].itemId,
          //   async product => {
          //     let newFullCartItems = this.state.fullCartItems;
          //     for (let j = 0; j < newFullCartItems.length; j++) {
          //       if (newFullCartItems[j].itemId === product.id) {
          //         newFullCartItems[j].item = product.data();
          //         newFullCartItems[j].imagePath = {
          //           uri: await FirebaseFunctions.getProductImg(
          //             product.data().businessId,
          //             product.id,
          //           ),
          //         };
          //       }
          //     }
          //   },
          // );
          totalCost += items.items[i].quantity * item.cost;
          tempFullCartItems[i] = {
            item,
            itemId: items.items[i].itemId,
            quantity: items.items[i].quantity,
            imagePath: {
              uri: await FirebaseFunctions.getProductImg(
                item.businessId,
                items.items[i].itemId,
              ),
            },
          };
        }
        this.setState({
          isLoading: false,
          totalCost,
          fullCartItems: tempFullCartItems,
        });
      },
    );
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{backgroundColor: colors.white, flex: 1}}>
        <Heading
          navigation={this.props.navigation}
          style={{}}
          defaultRow
          drawerNavigator>
          <Text style={localStyles.headerTxt}>Cart</Text>
        </Heading>
        <View
          style={{
            flex: 1,
            justifyContent:
              this.state.fullCartItems.length === 0 ? 'center' : 'flex-start',
          }}>
          {this.state.fullCartItems.length === 0 ? (
            <Text style={localStyles.noItemsTxt}>
              Add Items to Cart in order to view them here
            </Text>
          ) : (
            <ScrollView
              style={localStyles.scrollViewStyle}
              contentContainerStyle={localStyles.scrollViewContentContainer}>
              {this.state.fullCartItems.map((item, index) => (
                <View
                  key={index}
                  style={{
                    alignSelf: 'center',
                    borderBottomWidth: 2,
                    paddingBottom: 7,
                    marginBottom: 10,
                    overflow: 'visible',
                    width: scale(393.3),
                  }}>
                  <ProductItem
                    isHorizontal
                    inStock={item.item.inStock}
                    numReviews={item.item.numReviews}
                    itemId={item.itemId}
                    businessId={item.item.businessId}
                    addable={false}
                    navigation={this.props.navigation}
                    key={index}
                    businessName={item.item.businessName}
                    imagePath={item.imagePath}
                    name={item.item.name}
                    rating={item.item.rating}
                    location={item.item.businessName}
                    cost={item.item.cost}
                    categories={item.item.categories}
                    description={item.item.description}
                  />
                  <View style={localStyles.quantityAndRemoveButtonContainer}>
                    <View style={[localStyles.quantityDisplay]}>
                      <CustomPickerIcon
                        extraPrecedingText="quantity: "
                        defaultIndex={item.quantity - 1}
                        onChangeSelection={async value =>
                          await this.quantityChanged(index, value)
                        }
                        textStyle={{fontSize: moderateScale(15)}}
                        list={this.state.possibleQuantities}
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text style={localStyles.quantityText}>
                        cost: ${item.item.cost * item.quantity}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        onPress={() => this.removeFromCart(index)}
                        style={localStyles.removeBtnStyle}>
                        <Text style={localStyles.removeBtnTxtStyle}>
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        {this.state.fullCartItems.length === 0 ? null : (
          <View style={localStyles.totalCostContainer}>
            <Text style={localStyles.totalCostText}>
              Total Cost: ${this.state.totalCost}
            </Text>
          </View>
        )}
        {this.state.fullCartItems.length === 0 ? null : (
          <TouchableOpacity
            style={[localStyles.checkoutBtn]}
            onPress={async () => await this.moveToCheckout()}>
            <Text style={{color: colors.black, fontFamily: 'Arial-BoldMT'}}>
              Checkout
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  headingStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  totalCostText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
  },
  totalCostContainer: {
    position: 'absolute',
    top: verticalScale(672),
    left: scale(15),
    backgroundColor: colors.black,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
  },
  scrollViewContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsTxt: {
    textAlign: 'center',
    color: colors.grey,
  },
  scrollViewStyle: {
    backgroundColor: colors.white,
    paddingTop: verticalScale(29.87),
    flex: 1,
  },
  headerTxt: {
    width: scale(66.77),
    paddingTop: 10,
    color: colors.white,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'flex-end',
    fontFamily: 'Arial-BoldMT',
    fontSize: 25,
  },
  checkoutBtn: {
    paddingBottom: 8,
    width: scale(138),
    paddingLeft: 30,
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    justifyContent: 'center',
    paddingRight: 30,
    paddingTop: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 0,
    position: 'absolute',
    top: verticalScale(672),
    left: scale(262.2),
    alignItems: 'center',
    alignContent: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  quantityDisplay: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  quantityAndRemoveButtonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-end',
    justifyContent: 'center',
    //backgroundColor: colors.black,
    width: scale(372.6),
  },
  quantityText: {
    textAlign: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(15),
  },
  removeBtnStyle: {
    ...styles.next,
    marginRight: 3,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'flex-end',
    paddingTop: verticalScale(4.48),
    paddingBottom: verticalScale(4.48),
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  removeBtnTxtStyle: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
});
