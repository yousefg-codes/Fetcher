import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Button,
  ScrollView,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import SplashScreen from '../../components/Global Components/SplashScreen';
import {styles} from '../../config/Styles/globalStyles';
import {Icon} from 'react-native-elements';
import {ProductItem} from '../../components/Global Components/ProductItem';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import colors from '../../config/Styles/colors';
import LoadingDots from '../../components/Global Components/LoadingDots';

class Search extends Component {
  state = {
    isPrimaryLoading: true,
    isSecondaryLoading: false,
    searchVal: '',
    productsShown: [],
    productsSearched: [],
    allCurrentProducts: [],
    isSearching: false,
    displayingACategory: false,
    categorieImages: [],
    categorieImgName: [
      ['Fruits & Vegetables', 'Canned & Packaged Foods'],
      ['Beverages', 'Clothing & Wearable Accessories'],
      ['Tools & Home', 'Outdoors & Garden'],
      ['Electronics & Electronic Accessories', 'Art & School Supplies'],
      ['Personal Hygiene', 'Baked Goods'],
    ],
    imagesLoaded: [
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ],
    categorieText: [
      ['Fruits & Vegetables', 'Canned & Packaged Foods'],
      ['Beverages', 'Clothing & Wearable Accessories'],
      ['Tools & Home', 'Outdoors & Garden'],
      ['Electronics & Electronic Accessories', 'Art & School Supplies'],
      ['Personal Hygiene', 'Baked Goods'],
    ],
  };
  async searchAlg(txt) {
    if (txt.trim() === '') {
      this.setState({isSearching: false});
      return;
    }
    this.setState({isSearching: true});
    let filteredProducts = this.filter(txt.trim(), true);
    let tempProducts = [];
    if (filteredProducts.length == 0) {
      this.setState({
        productsSearched: (
          <Text style={localStyles.noProductsTxt}>
            Unfortunately we couldn't find the product you're searching for :(
          </Text>
        ),
      });
      return;
    }
    for (var i = 0; i < filteredProducts.length; i++) {
      let item = filteredProducts[i];
      tempProducts[i] = (
        <ProductItem
          style={{alignSelf: 'center'}}
          isHorizontal
          addable
          inStock={item.inStock}
          numReviews={item.numReviews}
          navigation={this.props.navigation}
          itemId={item.itemId}
          key={i}
          businessName={item.businessName}
          businessId={item.businessId}
          imagePath={{
            uri: await FirebaseFunctions.getProductImg(
              item.businessId,
              item.itemId,
            ),
          }}
          name={item.name}
          rating={item.rating}
          location={item.businessName}
          cost={item.cost}
          categories={item.categories}
          description={item.description}
        />
      );
    }
    this.setState({productsSearched: tempProducts.reverse()});
  }
  compare(searchText, productName) {
    if (searchText.length < 2 || productName.length < 2) {
      if (productName.includes(searchText)) {
        return 1;
      }
      return 0;
    }
    let searchTextEveryTwo = new Map();
    for (let i = 0; i < searchText.length - 1; i++) {
      let everyTwo = searchText.substr(i, 2);
      let count = searchTextEveryTwo.has(everyTwo)
        ? searchTextEveryTwo.get(everyTwo) + 1
        : 1;
      searchTextEveryTwo.set(everyTwo, count);
    }
    let matches = 0;
    for (let i = 0; i < productName.length - 1; i++) {
      let everyTwo = productName.substr(i, 2);
      let count = searchTextEveryTwo.has(everyTwo)
        ? searchTextEveryTwo.get(everyTwo)
        : 0;
      if (count > 0) {
        searchTextEveryTwo.set(everyTwo, count - 1);
        matches += 2;
      }
    }
    return matches / (searchText.length + productName.length - 2);
  }
  partition(array, comparisonArray, left, right) {
    let pivot = Math.floor((left + right) / 2);
    let leftPointer = left;
    let rightPointer = right;
    while (leftPointer <= rightPointer) {
      while (comparisonArray[leftPointer] < comparisonArray[pivot]) {
        leftPointer++;
      }
      while (comparisonArray[rightPointer] > comparisonArray[pivot]) {
        rightPointer--;
      }
      if (leftPointer <= rightPointer) {
        this.swap(array, leftPointer, rightPointer);
        this.swap(comparisonArray, leftPointer, rightPointer);
        leftPointer++;
        rightPointer--;
      }
    }
    return leftPointer;
  }
  swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }
  quickSort(array, comparisonArray, index1, index2) {
    let index;
    if (array.length > 1) {
      index = this.partition(array, comparisonArray, index1, index2);
      if (index1 < index - 1) {
        this.quickSort(array, comparisonArray, index1, index - 1);
      }
      if (index < index2) {
        this.quickSort(array, comparisonArray, index, index2);
      }
    }
  }
  filter(txt, isASearch) {
    let allProducts = [];
    let comparisonArray = [];
    let productsData = this.state.allCurrentProducts;
    var index = 0;
    for (var i = 0; i < productsData.length; i++) {
      if (isASearch) {
        let comparison = this.compare(
          txt.toLowerCase(),
          productsData[i].name.toLowerCase(),
        );
        if (comparison > 0) {
          comparisonArray.push(comparison);
          allProducts[index] = productsData[i];
          index++;
        }
      } else {
        //console.warn(txt);
        if (productsData[i].categories.includes(txt)) {
          allProducts[index] = productsData[i];
          index++;
        }
      }
    }
    if (isASearch) {
      this.quickSort(allProducts, comparisonArray, 0, allProducts.length - 1);
    }
    return allProducts;
  }
  returnToCategories() {
    this.setState({
      displayingACategory: false,
      allCurrentProducts: GlobalHandler.getProducts(),
    });
  }
  async displayThisCategory(categoryName) {
    this.setState({isSecondaryLoading: true});
    let tempProducts = [];
    let filteredProducts = this.filter(categoryName, false);
    for (var i = 0; i < filteredProducts.length; i++) {
      let item = filteredProducts[i];
      //console.log(item);
      tempProducts[i] = (
        <ProductItem
          isHorizontal
          inStock={item.inStock}
          numReviews={item.numReviews}
          style={{alignSelf: 'center'}}
          addable
          businessId={item.businessId}
          businessName={item.businessName}
          navigation={this.props.navigation}
          itemId={item.itemId}
          key={i}
          imagePath={{
            uri: await FirebaseFunctions.getProductImg(
              item.businessId,
              item.itemId,
            ),
          }}
          name={item.name}
          rating={item.rating}
          location={item.businessName}
          cost={item.cost}
          categories={item.categories}
          description={item.description}
        />
      );
    }
    if (tempProducts.length === 0) {
      tempProducts[0] = (
        <Text key={0} style={localStyles.noProductsTxt}>
          Unfortunately no businesses near you sell products in this category.
        </Text>
      );
    }
    this.setState({
      productsShown: tempProducts,
      displayingACategory: true,
      allCurrentProducts: filteredProducts,
      isSecondaryLoading: false,
    });
  }

  async componentDidMount() {
    const {categorieText, categorieImgName} = this.state;
    let categorieImages = [];
    GlobalHandler.state.screens[3] = this;
    let allProducts = GlobalHandler.getProducts();
    for (var i = 0; i < categorieText.length; i++) {
      let imageSource;
      // if (categorieImgName[i][0].includes('/')) {
      //   let tempName = categorieImgName[i][0];
      //   tempName =
      //     tempName.substring(0, tempName.indexOf('/')) +
      //     '&' +
      //     tempName.substring(tempName.indexOf('/') + 1);
      //   imageSource = await FirebaseFunctions.getCategoryImg(tempName);
      // } else {
      console.log(categorieImgName[i][0]);
      console.log(categorieImgName[i][1]);
      imageSource = await FirebaseFunctions.getCategoryImg(
        categorieImgName[i][0],
      );
      //}
      let secondImageSource;
      //if (categorieImgName[i][1].includes(' ')) {
      //  secondImageSource = await FirebaseFunctions.getCategoryImg(
      //    'FoodProducts',
      //  );
      //} else {
      secondImageSource = await FirebaseFunctions.getCategoryImg(
        categorieImgName[i][1],
      );
      //}
      categorieImages[i] = [imageSource, secondImageSource];
    }
    GlobalHandler.eventEmitter.addListener('updateProducts', () => {
      this.setState({allCurrentProducts: GlobalHandler.getProducts()});
    });
    this.setState({categorieImages, allCurrentProducts: allProducts});
    this.setState({isPrimaryLoading: false});
  }
  render() {
    if (this.state.isPrimaryLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <SearchBar
          onCancel={() => this.setState({searchVal: ''})}
          value={this.state.searchVal}
          onChangeText={searchVal => {
            this.setState({searchVal});
            this.searchAlg(searchVal);
          }}
          containerStyle={localStyles.searchBarContainerStyle}
          inputContainerStyle={localStyles.searchBarInputContainerStyle}
          inputStyle={{
            fontFamily: 'Arial-BoldMT',
            fontSize: verticalScale(19.91),
          }}
          placeholder="Look for items here..."
        />
        <ScrollView style={{marginTop: verticalScale(12.16)}}>
          <FlatList
            data={this.state.categorieImages}
            renderItem={({item, index, separators}) => {
              return (
                <View key={index} style={localStyles.dualCategoryView}>
                  <View
                    style={{
                      width: scale(10.35),
                      alignItems: 'center',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      this.displayThisCategory(
                        this.state.categorieImgName[index][0],
                      )
                    }
                    style={localStyles.categories}>
                    <ImageBackground
                      source={{
                        uri: this.state.categorieImages[index][0],
                      }}
                      onLoadEnd={() => {
                        //console.log('AHHHH'+index)
                        let temp = this.state.imagesLoaded.slice();
                        temp[index][0] = true;
                        this.setState({imagesLoaded: temp});
                      }}
                      opacity={0.3}
                      borderRadius={125 / 20}
                      style={[
                        localStyles.categories,
                        {backgroundColor: 'rgba(0,0,0,0.7)'},
                      ]}
                      onPress={() => {}}>
                      <Text style={localStyles.categorieTextStyle}>
                        {this.state.categorieText[index][0]}
                      </Text>
                    </ImageBackground>
                    {this.state.imagesLoaded[index][0] ? null : (
                      <View
                        style={[
                          localStyles.categories,
                          {
                            transform: [{translateY: -1}],
                            backgroundColor: colors.white,
                            position: 'absolute',
                            borderColor: colors.white,
                          },
                        ]}>
                        <LoadingDots size={10} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      width: scale(10.35),
                      alignItems: 'center',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      this.displayThisCategory(
                        this.state.categorieImgName[index][1],
                      )
                    }
                    style={localStyles.categories}>
                    <ImageBackground
                      source={{
                        uri: this.state.categorieImages[index][1],
                      }}
                      onLoadEnd={() => {
                        let temp = this.state.imagesLoaded.slice();
                        temp[index][1] = true;
                        this.setState({imagesLoaded: temp});
                      }}
                      opacity={0.3}
                      borderRadius={125 / 20}
                      style={[
                        localStyles.categories,
                        {backgroundColor: 'rgba(0,0,0,0.7)'},
                      ]}
                      onPress={() => {}}>
                      <Text style={localStyles.categorieTextStyle}>
                        {this.state.categorieText[index][1]}
                      </Text>
                    </ImageBackground>
                    {this.state.imagesLoaded[index][1] ? null : (
                      <View
                        style={[
                          localStyles.categories,
                          {
                            transform: [{translateY: -1}],
                            backgroundColor: colors.white,
                            position: 'absolute',
                            borderColor: colors.white,
                          },
                        ]}>
                        <LoadingDots size={10} />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={{width: scale(10.35)}} />
                </View>
              );
            }}
          />
        </ScrollView>
        {this.state.isSearching || this.state.displayingACategory ? (
          <ScrollView style={localStyles.noCategoriesContainer}>
            {this.state.isSearching
              ? this.state.productsSearched
              : this.state.displayingACategory
              ? this.state.productsShown
              : null}
          </ScrollView>
        ) : null}
        {this.state.displayingACategory ? (
          <TouchableOpacity
            style={localStyles.backArrow}
            onPress={() => this.returnToCategories()}>
            <Icon
              size={moderateScale(30)}
              name="arrow-back"
              color={colors.white}
            />
          </TouchableOpacity>
        ) : null}
        {this.state.isSecondaryLoading ? (
          <View style={localStyles.secondaryLoaderContainer}>
            <SplashScreen />
          </View>
        ) : null}
      </View>
    );
  }
}
export default Search;

const localStyles = StyleSheet.create({
  categories: {
    width: scale(188.18),
    height: verticalScale(143.36),
    borderWidth: 1,
    top: 2,
    borderRadius: 125 / 20,
    borderColor: colors.transparent,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 3, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.5,
    elevation: 3,
    flexDirection: 'column',
    // background color must be set
    backgroundColor: colors.white, // invisible color
  },
  secondaryLoaderContainer: {
    width: scale(414),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  categorieTextStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '90%',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
    color: colors.white,
  },
  backArrow: {
    ...styles.next,
    borderColor: colors.black,
    backgroundColor: colors.black,
    position: 'absolute',
    top: verticalScale(627.2),
    left: 10,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  searchBarContainerStyle: {
    backgroundColor: colors.black,
    height: verticalScale(74.67),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noProductsTxt: {
    color: '#808080',
    maxWidth: scale(372.6),
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
    alignSelf: 'center',
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
  noCategoriesContainer: {
    position: 'absolute',
    top: verticalScale(74.67),
    width: scale(414),
    height: verticalScale(821.33),
    backgroundColor: colors.white,
    left: 0,
  },
  searchBarInputContainerStyle: {
    backgroundColor: colors.white,
    height: verticalScale(44.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dualCategoryView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: verticalScale(18.25),
  },
});
