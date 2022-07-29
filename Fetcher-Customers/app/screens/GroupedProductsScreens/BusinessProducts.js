import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {SearchBar, Icon} from 'react-native-elements';
import SplashScreen from '../../components/Global Components/SplashScreen';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {ProductItem} from '../../components/Global Components/ProductItem';
import {styles} from '../../config/Styles/globalStyles';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';

export default class BusinessProducts extends Component {
  state = {
    isLoading: true,
    searchVal: '',
    CategorieComponents: [],
    productsShown: [],
    productsSearched: [],
    allCurrentProducts: [],
    isSearching: false,
  };
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
  async searchAlg(txt) {
    if (txt == '') {
      this.setState({isSearching: false});
      return;
    }
    this.setState({isSearching: true});
    let filteredProducts = this.filter(txt, true);
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
          numReviews={item.numReviews}
          style={{alignSelf: 'center'}}
          isHorizontal
          addable
          navigation={this.props.navigation}
          itemId={item.itemId}
          key={i}
          inStock={item.inStock}
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
    this.setState({
      productsSearched: tempProducts.reverse(),
    });
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
  filter(txt, isSearching) {
    let allProducts = [];
    let comparisonArray = [];
    let productsData = this.state.allCurrentProducts;
    var index = 0;
    for (var i = 0; i < productsData.length; i++) {
      if (isSearching) {
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
        //console.log(productsData[i]);
        if (productsData[i].businessId === txt) {
          allProducts.push(productsData[i]);
        }
      }
    }
    if (isSearching) {
      this.quickSort(allProducts, comparisonArray, 0, allProducts.length - 1);
    }
    return allProducts;
  }
  async componentDidMount() {
    let allProducts = GlobalHandler.getProducts();
    this.setState({allCurrentProducts: allProducts}, () => {
      let filteredProducts = this.filter(
        this.props.navigation.state.params.businessId,
        false,
      );
      this.setState({allCurrentProducts: filteredProducts}, () => {
        this.showAllBusinessProducts();
        this.setState({isLoading: false});
      });
    });
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
  async showAllBusinessProducts() {
    let filteredProducts = this.state.allCurrentProducts;
    let tempProductComponents = [];
    for (var i = 0; i < filteredProducts.length; i++) {
      let item = filteredProducts[i];
      tempProductComponents[i] = (
        <ProductItem
          numReviews={item.numReviews}
          isHorizontal
          style={{alignSelf: 'center'}}
          addable
          inStock={item.inStock}
          navigation={this.props.navigation}
          itemId={item.itemId}
          businessId={item.businessId}
          key={i}
          businessName={item.businessName}
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
    if (tempProductComponents.length === 0) {
      tempProductComponents[0] = (
        <Text key={0} style={localStyles.noProductsTxt}>
          Unfortunately this business has not added any products yet.
        </Text>
      );
    }
    this.setState({
      productsShown: tempProductComponents,
    });
  }
  swap(array, index1, index2) {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
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
        <ScrollView
          style={{
            marginTop: verticalScale(12.16),
          }}>
          {this.state.isSearching
            ? this.state.productsSearched
            : this.state.productsShown}
        </ScrollView>
        {!this.state.isSearching ? (
          <TouchableOpacity
            style={localStyles.backArrow}
            onPress={() => this.props.navigation.goBack(null)}>
            <Icon
              size={moderateScale(30)}
              name="arrow-back"
              color={colors.white}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  categories: {
    width: scale(188.18),
    height: verticalScale(179.2),
    borderWidth: 1,
    top: 2,
    borderRadius: 125 / 20,
    borderColor: colors.transparent,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 5, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
    flexDirection: 'column',
    // background color must be set
    backgroundColor: colors.transparent, // invisible color
  },
  categorieTextStyle: {
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    color: colors.white,
  },
  backArrow: {
    ...styles.next,
    borderColor: colors.black,
    backgroundColor: colors.black,
    position: 'absolute',
    top: verticalScale(716.8),
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
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
    alignSelf: 'center',
    textAlign: 'center',
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
