import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import Heading from './Heading';
import {styles} from '../../config/Styles/globalStyles';
import Maps from '../Map/Maps';
import SplashScreen from './SplashScreen';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import {
  FullStar,
  EmptyStar,
  HalfStar,
} from '../../config/Image Requires/imageImports';
import colors from '../../config/Styles/colors';
import LoadingDots from './LoadingDots';
import {showMessage} from 'react-native-flash-message';
import {Icon} from 'react-native-elements';
import {Platform} from 'react-native';

class ProductItem extends Component {
  state = {
    stars: [],
    imageIsLoading: true,
  };
  componentDidMount() {
    this.setState({
      stars: determineNumStars(
        this.props.rating,
        this.productItemStyles.starStyle,
      ),
    });
  }
  ImageIsHorizontal = {
    marginBottom: this.props.isHorizontal
      ? verticalScale(13.78)
      : verticalScale(5),
    height: this.props.isHorizontal ? verticalScale(160) : verticalScale(250),
    width: this.props.isHorizontal ? scale(393.3) : scale(157.32),
    flexDirection: this.props.isHorizontal ? 'row' : 'column',
  };
  renderProductItem() {
    return (
      <View
        style={[
          Platform.OS === 'ios'
            ? {
                borderWidth: 2,
                borderColor: colors.transparent,
                elevation: 2,
                //backgroundColor: colors.transparent,
                shadowOpacity: 0.5,
                shadowColor: colors.black,
                shadowOffset: {height: 3, width: 3},
              }
            : {},
        ]}>
        <TouchableOpacity
          style={[
            this.productItemStyles.itemButton,
            this.ImageIsHorizontal,
            this.props.style,
            {
              opacity: this.props.inStock ? 1.0 : 0.6,
              overflow: 'hidden',
            },
            Platform.OS === 'android'
              ? {borderColor: colors.grey}
              : {borderColor: colors.transparent},
          ]}
          disabled={!this.props.inStock}
          onPress={() => {
            this.props.navigation.push('ProductInfo', this.props);
          }}>
          <Image
            source={this.props.imagePath}
            resizeMode="cover"
            onLoadEnd={() => {
              this.setState({imageIsLoading: false});
            }}
            style={this.productItemStyles.imageStyle}
          />
          {this.state.imageIsLoading ? (
            <View
              style={[
                this.productItemStyles.imageStyle,
                this.productItemStyles.imageLoader,
                {backgroundColor: colors.white, borderColor: colors.white},
              ]}>
              <LoadingDots size={12} />
            </View>
          ) : null}
          <View
            style={{
              paddingLeft: this.props.isHorizontal ? scale(5.91) : 0,
              justifyContent: this.props.isHorizontal
                ? 'space-evenly'
                : 'flex-start',
              width: '100%',
              overflow: 'hidden',
            }}>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT',
                fontSize: this.props.isHorizontal ? 20 : 15,
              }}>
              {this.props.name}
            </Text>
            <View
              style={{
                width: this.props.isHorizontal ? '66%' : '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {/* <Text
              style={{
                fontFamily: 'Arial-BoldMT', fontSize: this.props.isHorizontal ? 16 : 12,
                color: '#808080',
              }}>
              {this.props.description}
            </Text> */}
              <Text
                style={{
                  fontFamily: 'Arial-BoldMT',
                  fontSize: this.props.isHorizontal ? 16 : 12,
                  color: '#000000',
                }}>
                ${this.props.cost}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT',
                fontSize: this.props.isHorizontal ? 16 : 12,
                width: '100%',
                color: '#808080',
              }}>
              {this.props.businessName}
            </Text>
            <View style={{flexDirection: 'row'}}>
              {this.state.stars}
              <Text style={this.productItemStyles.ratingText}>
                {this.props.rating.toFixed(1)}
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{
                alignItems: 'center',
              }}>
              {this.props.categories.map((element, index) => (
                <View
                  style={[
                    productInfoStyles.categories,
                    {
                      paddingVertical: verticalScale(4.48),
                      paddingHorizontal: scale(6.21),
                      marginLeft: scale(5),
                    },
                  ]}>
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: 'Arial-BoldMT',
                    }}>
                    {element}
                  </Text>
                </View>
              ))}
            </ScrollView>
            {/* {!this.props.addable ? (
            <View
              style={this.productItemStyles.quantityAndRemoveButtonContainer}>
              <View
                style={this.productItemStyles.quantityDisplay}>
                <Text
                  style={this.productItemStyles.quantityText}>
                  quantity: {this.props.quantity}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() => this.props.onRemovePress()}
                  style={this.productItemStyles.removeBtnStyle}>
                  <Text style={this.productItemStyles.removeBtnTxtStyle}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null} */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    if (this.props.deleted) {
      return (
        <TouchableOpacity
          style={[
            this.productItemStyles.itemButton,
            this.ImageIsHorizontal,
            this.props.style,
          ]}
          disabled={true}>
          <Text style={this.productItemStyles.outOfStockText}>
            Deleted Product
          </Text>
        </TouchableOpacity>
      );
    }
    if (!this.props.inStock) {
      return (
        <View>
          {this.renderProductItem()}
          <Text style={this.productItemStyles.outOfStockText}>
            Out of Stock
          </Text>
        </View>
      );
    }
    return this.renderProductItem();
  }
  productItemStyles = StyleSheet.create({
    itemButton: {
      backgroundColor: colors.white,
      alignSelf: 'center',
      marginTop: 2,
      //marginLeft: (0.5 * screenWidth) / 20,
      padding: 3,
      borderWidth: 2,
      borderRadius: 5,
    },
    quantityDisplay: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
    },
    quantityAndRemoveButtonContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      //backgroundColor: colors.black,
      height: verticalScale(44.8),
      width: scale(247.05),
    },
    quantityText: {
      textAlign: 'center',
      backgroundColor: colors.white,
      fontFamily: 'Arial-BoldMT',
      fontSize: moderateScale(15),
      paddingBottom: verticalScale(6.08),
      marginRight: scale(10.56),
    },
    starStyle: {
      height: scale(20.7),
      width: scale(20.7),
    },
    imageLoader: {
      position: 'absolute',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ratingText: {
      fontFamily: 'Arial-BoldMT',
      fontSize: this.props.isHorizontal ? 20 : 14,
      color: '#808080',
      marginLeft: this.props.isHorizontal ? scale(13.8) : scale(11.83),
    },
    imageStyle: {
      height: this.props.isHorizontal ? '100%' : verticalScale(112),
      width: this.props.isHorizontal ? verticalScale(128) : scale(138),
      paddingLeft: 5,
      alignSelf: 'center',
      borderLeftWidth: this.props.isHorizontal ? 5 : 0,
      borderTopLeftRadius: this.props.isHorizontal ? 5 : 0,
      borderBottomLeftRadius: this.props.isHorizontal ? 5 : 0,
      borderWidth: this.props.isHorizontal ? 0 : 5,
      borderRadius: this.props.isHorizontal ? 0 : 5,
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
    outOfStockText: {
      position: 'absolute',
      color: colors.red,
      fontFamily: 'Arial-BoldMT',
      fontSize: moderateScale(20),
      opacity: 1.4,
      left: '35%',
      top: '40%',
    },
    text: {
      backgroundColor: colors.black,
      color: colors.white,
      fontFamily: 'Arial-BoldMT',
      fontSize: 15,
    },
    marker: {
      backgroundColor: colors.black,
      borderWidth: 2,
      borderRadius: 2,
    },
  });
}
class ProductInfo extends Component {
  state = {
    businessLocations: {},
    isLoading: true,
    stars: [],
    similarItems: [],
    imageHasLoaded: false,
    item: {
      ...this.props.navigation.state.params,
    },
  };
  async componentDidMount() {
    let data = null;
    console.log(GlobalHandler.state.businessLocations);
    for (let i = 0; i < GlobalHandler.state.businessLocations.length; i++) {
      console.warn(GlobalHandler.state.businessLocations[i].businessName);
      if (
        GlobalHandler.state.businessLocations[i].businessName ===
        this.state.item.location
      ) {
        data = GlobalHandler.state.businessLocations[i].businessLocation;
      }
    }
    console.warn(this.state.item.location);
    let allProducts = GlobalHandler.getProducts();
    let filteredProducts = [];
    console.log(allProducts);
    for (var i = 0; (i < 10) & (i < allProducts.length); i++) {
      for (var j = 0; j < this.state.item.categories.length; j++) {
        if (allProducts[i].itemId !== this.state.item.itemId) {
          if (
            allProducts[i].categories.includes(this.state.item.categories[j]) &&
            !filteredProducts.includes(allProducts[i])
          ) {
            filteredProducts[i] = {
              item: allProducts[i],
              imagePath: {
                uri: await FirebaseFunctions.getProductImg(
                  allProducts[i].businessId,
                  allProducts[i].itemId,
                ),
              },
            };
          }
        }
      }
    }
    this.setState({
      stars: determineNumStars(
        this.state.item.rating,
        productInfoStyles.starStyle,
      ),
    });
    this.setState({
      businessLocation: data,
      similarItems: filteredProducts,
      isLoading: false,
    });
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{backgroundColor: colors.white, flex: 1}}>
        <Heading
          defaultRow
          onPress={() => this.props.navigation.goBack(null)}
          navigation={this.props.navigation}
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            alignContent: 'center',
          }}
        />
        <ScrollView style={{height: verticalScale(1344)}}>
          <Image
            source={this.state.item.imagePath}
            resizeMode="contain"
            onLoadEnd={() => {
              this.setState({imageHasLoaded: true});
            }}
            style={{
              height: verticalScale(224),
              width: scale(414),
            }}
          />
          {this.state.imageHasLoaded ? null : (
            <View
              style={{
                height: verticalScale(224),
                width: scale(414),
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                top: 0,
              }}>
              <LoadingDots size={20} />
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push('RateProductScreen', {
                itemId: this.state.item.itemId,
                currentItemRating: this.state.item.rating,
              })
            }
            style={productInfoStyles.addRatingButton}>
            <Icon
              type="material"
              name="rate-review"
              color={colors.black}
              size={scale(36)}
            />
            {/* {//SCCCALLELED} */}
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                paddingBottom: verticalScale(22.4),
                borderBottomWidth: 2,
                borderBottomColor: colors.lightGrey,
                justifyContent: 'space-evenly',
                height: verticalScale(218.4),
              }}>
              <Text style={productInfoStyles.productName}>
                {this.state.item.name}
              </Text>
              <Text style={productInfoStyles.productDescription}>
                {this.state.item.description}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  width: scale(220),
                  // marginTop: verticalScale(10),
                  // marginBottom: verticalScale(10),
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={[
                    productInfoStyles.text,
                    {fontSize: moderateScale(18), marginRight: scale(10)},
                  ]}>
                  {this.state.item.rating.toFixed(1)}
                </Text>
                <View style={{flexDirection: 'row'}}>{this.state.stars}</View>
                <Text
                  style={[
                    productInfoStyles.text,
                    {fontSize: moderateScale(18), marginLeft: scale(10)},
                  ]}>
                  {this.state.item.numReviews} reviews
                </Text>
              </View>
              <TouchableOpacity
                style={productInfoStyles.clickHereForMore}
                onPress={() => {
                  this.props.navigation.push('BusinessProducts', {
                    businessId: this.state.item.businessId,
                  });
                }}>
                <Text style={[productInfoStyles.text, {color: colors.white}]}>
                  {this.state.item.location}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  productInfoStyles.text,
                  {
                    marginRight: scale(13.8),
                    color: colors.black,
                    fontSize: moderateScale(18),
                  },
                ]}>
                Cost: ${this.state.item.cost}
              </Text>
            </View>
            {/* <View style={productInfoStyles.infoWrapper}>
              <Text style={productInfoStyles.text}>
                Business Location: {this.state.Location}
              </Text>
            </View> */}
            {
              //I am debating whether I should give every item a map, since that is highly ineffective,
              //when it comes to costs.
            }
            {/* {this.state.businessLocations.docs.length === 0 ?
                <Text style={[productInfoStyles.text, {color: colors.darkYellow, alignSelf: 'center', textAlign: 'center'}]}>We can't display the location since this product is too far from your current main address</Text>
              : <Maps
                style={{ position: 'relative' }}
                zoomOnBusinessGiven
                navigation={this.props.navigation}
                businessLocations={this.state.businessLocations}
              />
            } */}
            {/* <Text style={productInfoStyles.productDescription}>
              {this.state.item.description}
            </Text> */}
            <View
              style={{
                height: verticalScale(71.68),
                paddingBottom: verticalScale(8.96),
                borderBottomWidth: 2,
                borderBottomColor: colors.lightGrey,
                justifyContent: 'space-evenly',
              }}>
              <Text
                style={[
                  productInfoStyles.text,
                  {
                    alignSelf: 'flex-start',
                    fontSize: moderateScale(18),
                    marginLeft: scale(4.14),
                  },
                ]}>
                Business Info
              </Text>
              <Text
                style={[
                  productInfoStyles.text,
                  {
                    alignSelf: 'flex-start',
                    color: colors.black,
                    marginLeft: scale(8.28),
                  },
                ]}>
                {this.state.businessLocation}
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: colors.lightGrey,
              }}>
              <Text
                style={[
                  productInfoStyles.text,
                  {
                    alignSelf: 'flex-start',
                    fontSize: moderateScale(18),
                    marginLeft: scale(4.14),
                  },
                ]}>
                Categories
              </Text>
              <ScrollView
                horizontal
                style={{
                  height: verticalScale(67.2),
                  paddingLeft: scale(8.28),
                }}>
                {this.state.item.categories.map((string, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      productInfoStyles.categories,
                      {
                        marginRight: scale(5),
                      },
                    ]}
                    onPress={() => {
                      this.props.navigation.push('CategoryProductsScreen', {
                        category: string,
                      });
                    }}>
                    <Text
                      style={[
                        productInfoStyles.text,
                        {color: colors.white, fontSize: moderateScale(18)},
                      ]}>
                      {string}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: colors.lightGrey,
                height: verticalScale(286.72),
                justifyContent: 'space-evenly',
              }}>
              <Text
                style={[
                  productInfoStyles.text,
                  {
                    alignSelf: 'flex-start',
                    fontSize: moderateScale(18),
                    marginLeft: scale(4.14),
                  },
                ]}>
                Related
              </Text>
              {this.state.similarItems.length === 0 ? (
                <Text style={[productInfoStyles.text, {textAlign: 'center'}]}>
                  Unfortunately, there are are no other items in this category
                  yet
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  style={{
                    height: verticalScale(224),
                    paddingLeft: scale(8.28),
                  }}>
                  {this.state.similarItems.map((element, index) => (
                    <ProductItem
                      key={index}
                      addable
                      location={element.item.businessName}
                      navigation={this.props.navigation}
                      imagePath={element.imagePath}
                      {...element.item}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={{height: verticalScale(89.6)}} />
          </View>
        </ScrollView>
        {this.state.item.addable ? (
          <TouchableOpacity
            style={[
              productInfoStyles.addToCart,
              {
                position: 'absolute',
                bottom: verticalScale(17.92),
                left: scale(41.4),
              },
            ]}
            onPress={async () => {
              await this.addToCart(this.state.item.itemId);
              this.props.navigation.goBack(null);
            }}>
            <Text
              style={[
                productInfoStyles.clickHereForMoreText,
                {fontSize: moderateScale(24)},
              ]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  cartIncludes(cart, itemId) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].itemId === itemId) {
        return i;
      }
    }
    return -1;
  }
  async addToCart(itemId) {
    let items = (await FirebaseFunctions.getCurrentUserData('cart')).items;
    let indexInCart = this.cartIncludes(items, itemId);
    if (indexInCart !== -1) {
      items[indexInCart].quantity += 1;
    } else {
      items.push({itemId, quantity: 1});
    }
    await FirebaseFunctions.editCart(items);
    if (GlobalHandler.state.screens[2] !== undefined) {
      await GlobalHandler.state.screens[2].componentDidMount();
    }
    showMessage({
      message: 'Item Added',
      type: 'success',
      description: 'this item has been added to your cart',
      position: 'top',
      duration: 3000,
    });
  }
}
const productInfoStyles = StyleSheet.create({
  text: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
    //marginTop: screenHeight/50,
    color: colors.grey,
    alignSelf: 'center',
    //marginLeft: screenWidth/30
  },
  addToCart: {
    width: scale(331.2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8.96),
    backgroundColor: colors.black,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 20,
  },
  productDescription: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.black,
  },
  productName: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    alignSelf: 'center',
    color: colors.black,
  },
  infoWrapper: {
    ...styles.next,
    marginRight: 0,
    padding: 9,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  addRatingAndRatingContainer: {
    width: scale(414),
    height: verticalScale(134.4),
    justifyContent: 'space-evenly',
  },
  addRatingButton: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: verticalScale(161.28),
    left: scale(20.7),
    paddingVertical: scale(6.21),
    paddingHorizontal: scale(8.28),
  },
  starStyle: {
    height: scale(24.56),
    width: scale(24.56),
  },
  clickHereForMore: {
    backgroundColor: colors.black,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: scale(4.14),
    paddingHorizontal: scale(12.42),
  },
  categories: {
    backgroundColor: colors.black,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: scale(6.21),
    paddingHorizontal: scale(16.56),
  },
  clickHereForMoreText: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
    color: colors.white,
  },
});
class RateProductScreen extends Component {
  state = {
    stars: [],
    explainWhyText: '',
    ratingText: '',
    filled: false,
    ...this.props.navigation.state.params,
  };
  componentDidMount() {
    let stars = determineNumStars(0, rateProductStyles.starStyle);
    this.setState({stars});
  }
  checkText() {
    if (this.state.explainWhyText !== '' && this.state.ratingText !== '') {
      this.setState({filled: true});
    } else {
      this.setState({filled: false});
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Heading
          defaultRow
          onPress={() => this.props.navigation.goBack(null)}
          navigation={this.props.navigation}
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            width: scale(414),
            alignContent: 'center',
          }}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{alignItems: 'center'}}
          style={{flex: 1, backgroundColor: colors.white}}>
          <View style={rateProductStyles.starsAndRatingContainer}>
            <View
              style={{
                width: scale(165.6),
                maxWidth: scale(165.6),
                flexDirection: 'row',
              }}>
              {this.state.stars}
            </View>
            <TextInput
              style={rateProductStyles.ratingTextInput}
              value={this.state.ratingText}
              keyboardType="numeric"
              key="number"
              placeholder="Rating"
              onChangeText={text => {
                this.setState({ratingText: text}, () => {
                  this.checkText();
                });
                if (parseFloat(text) > 5.0) {
                  this.setState({
                    stars: determineNumStars(5.0, rateProductStyles.starStyle),
                  });
                } else if (text === '') {
                  this.setState({
                    stars: determineNumStars(0.0, rateProductStyles.starStyle),
                  });
                } else {
                  this.setState({
                    stars: determineNumStars(
                      parseFloat(text),
                      rateProductStyles.starStyle,
                    ),
                  });
                }
              }}
            />
          </View>
          <Text style={rateProductStyles.explainWhyText}>
            Please explain why you gave this rating:
          </Text>
          <TextInput
            style={rateProductStyles.explainWhyTextInput}
            multiline
            key="explain"
            placeholder="Explain..."
            value={this.state.explainWhyText}
            onChangeText={text => {
              this.setState({explainWhyText: text}, () => {
                this.checkText();
              });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              //console.log(this.state.item.itemId)
              let rating =
                parseFloat(this.state.ratingText) > 5
                  ? 5
                  : parseFloat(this.state.ratingText);
              FirebaseFunctions.addRating(
                this.state.itemId,
                rating,
                this.state.explainWhyText,
              );
              showMessage({
                message: 'Submitted',
                description: 'Your rating has been added',
                duration: 1000,
                type: 'success',
              });
              this.props.navigation.goBack(null);
            }}
            disabled={!this.state.filled}
            style={[
              rateProductStyles.submitButton,
              {
                borderColor: this.state.filled
                  ? colors.black
                  : colors.lightGrey,
                backgroundColor: this.state.filled
                  ? colors.black
                  : colors.lightGrey,
              },
            ]}>
            <Text style={rateProductStyles.submitText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
const rateProductStyles = StyleSheet.create({
  submitButton: {
    ...styles.next,
    marginRight: 0,
  },
  starStyle: {
    width: scale(33.12),
    height: scale(33.12),
  },
  submitText: {
    fontSize: moderateScale(18),
    fontFamily: 'Arial-BoldMT',
    color: colors.white,
  },
  starsAndRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: verticalScale(17.92),
  },
  explainWhyText: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(26.88),
    marginBottom: verticalScale(8.96),
    color: colors.black,
    fontFamily: 'Arial-BoldMT',
    textAlign: 'center',
  },
  explainWhyTextInput: {
    paddingLeft: 5,
    borderWidth: 2,
    fontFamily: 'Arial-BoldMT',
    borderRadius: 10,
    justifyContent: 'flex-start',
    width: scale(269.1),
    textAlignVertical: 'top',
    height: verticalScale(179.2),
    fontSize: moderateScale(16),
    color: colors.black,
  },
  ratingTextInput: {
    borderWidth: 2,
    fontFamily: 'Arial-BoldMT',
    borderRadius: 10,
    paddingLeft: 5,
    width: scale(82.8),
    fontSize: moderateScale(16),
    color: colors.black,
  },
});
const determineNumStars = (rating, style) => {
  let arr = [];
  let lastIndex = -1;
  for (var i = 0; i < parseInt(rating); i++) {
    arr[i] = <Image key={i} style={style} source={FullStar} />;
    lastIndex = i;
  }
  if (parseFloat(rating) % 1.0 >= 0.35 && parseFloat(rating) % 1.0 <= 0.65) {
    arr[lastIndex + 1] = <Image key={i} style={style} source={HalfStar} />;
    lastIndex++;
  } else if (parseFloat(rating) % 1.0 > 0.85) {
    arr[lastIndex + 1] = <Image key={i} style={style} source={FullStar} />;
    lastIndex++;
  }
  for (var i = lastIndex + 1; i < 5; i++) {
    arr[i] = <Image style={style} key={i} source={EmptyStar} />;
  }
  return arr;
};

export {ProductInfo, RateProductScreen, ProductItem};
