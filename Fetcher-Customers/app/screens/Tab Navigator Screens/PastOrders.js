import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import SplashScreen from '../../components/Global Components/SplashScreen';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import Heading from '../../components/Global Components/Heading';
import colors from '../../config/Styles/colors';
import {styles} from '../../config/Styles/globalStyles';
import {ProductItem} from '../../components/Global Components/ProductItem';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';
import TrackOrderComponent from '../../components/Global Components/TrackOrderComponent';

class PastOrders extends Component {
  state = {
    isLoading: true,
    orderComponents: [],
    orders: [],
    currentOrdersFullObj: [],
    oldestDocId: -1,
    isRefreshing: false,
  };
  async currentOrdersRefresh(data) {
    let currentOrders = data.currentOrders;
    let copy = this.state.currentOrdersFullObj.slice();
    if (this.state.currentOrdersFullObj.length > currentOrders.length) {
      copy.shift();
    } else {
      let orderDetails = await FirebaseFunctions.getOrder(
        currentOrders[currentOrders.length - 1].orderId,
      );
      copy.push(orderDetails);
    }
    //console.log('AHDHFGSIHJGIEWJGWJI')
    //console.log(copy)
    this.setState({currentOrdersFullObj: copy});
  }
  pastOrdersRefresh(docData, docId) {
    let copy = this.state.orders.slice();
    for (var i = 0; i < this.state.orders.length; i++) {
      if (docId === this.state.orders[i].docId) {
        copy[i] = {docId, orders: docData.orders};
        this.setState({orders: copy});
        return;
      }
    }
  }
  addToPastOrders(docData, docId, isOldDoc) {
    let copy = this.state.orders.slice();
    if (docId < this.state.oldestDocId) {
      this.setState({oldestDocId: docId});
    }
    if (isOldDoc) {
      //console.log('OH HEY')
      copy.unshift({docId, orders: docData.orders});
      this.setState({orders: copy});
      return;
    }
    copy.push({docId, orders: docData.orders});
    this.setState({orders: copy, isLoading: false});
  }
  async updateCurrentOrders() {
    let currentOrdersFullObj = [];
    for (var i = 0; i < GlobalHandler.currentOrders.length; i++) {
      let orderData = await FirebaseFunctions.getOrder(
        GlobalHandler.currentOrders[i].orderId,
      );
      currentOrdersFullObj.push(orderData);
    }
    this.setState({currentOrdersFullObj});
  }
  async componentDidMount() {
    GlobalHandler.state.screens[4] = this;
    FirebaseFunctions.listenOnCurrentOrders(
      async data => await this.currentOrdersRefresh(data),
    );
    let lastOrderIndex = (await FirebaseFunctions.getCurrentUserData(
      'commonData',
    )).lastOrderIndex;
    await FirebaseFunctions.loadPastOrder(
      lastOrderIndex,
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
      false,
    );
    let currentOrdersFullObj = [];
    for (var i = 0; i < GlobalHandler.currentOrders.length; i++) {
      let orderData = await FirebaseFunctions.getOrder(
        GlobalHandler.currentOrders[i].orderId,
      );
      currentOrdersFullObj.push(orderData);
    }
    this.setState({
      currentOrdersFullObj,
      oldestDocId: lastOrderIndex,
    });
    FirebaseFunctions.checkForNewPastOrderDocs(
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
    );
  }
  async loadOldOrders() {
    this.setState({isRefreshing: true});
    if (this.state.oldestDocId - 1 < 0) {
      this.setState({isRefreshing: false});
      return;
    }
    //console.log('HEy')
    await FirebaseFunctions.loadPastOrder(
      this.state.oldestDocId - 1,
      (docData, docId) => this.pastOrdersRefresh(docData, docId),
      (docData, docId, isOldDoc) =>
        this.addToPastOrders(docData, docId, isOldDoc),
      true,
    );
    this.setState({isRefreshing: false});
  }
  createOrder(
    numItems,
    totalCost,
    driverName,
    listIndex,
    orderIndex,
    date,
    businessName,
  ) {
    return (
      <TouchableOpacity
        onPress={() => this.navigateToOrderDetails(listIndex, orderIndex)}
        key={listIndex * (orderIndex + 1)}
        style={localStyles.pastOrderObjView}>
        <View style={{justifyContent: 'space-evenly', height: '95%'}}>
          <Text
            style={{
              marginTop: 5,
              marginBottom: verticalScale(12.16),
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(16),
              color: colors.white,
            }}>
            Number of Items Ordered: {numItems}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT',
                fontSize: moderateScale(16),
                marginBottom: verticalScale(12.16),
                color: colors.white,
              }}>
              Total Order Cost: ${totalCost}
            </Text>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT',
                fontSize: moderateScale(16),
                marginBottom: verticalScale(12.16),
                color: colors.white,
              }}>
              Date: {date}
            </Text>
          </View>
          <Text
            style={{
              marginBottom: verticalScale(12.16),
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(16),
              color: colors.white,
            }}>
            Driver: {driverName}
          </Text>
          <Text
            style={{
              marginBottom: verticalScale(12.16),
              fontFamily: 'Arial-BoldMT',
              fontSize: moderateScale(16),
              color: colors.white,
            }}>
            Business: {businessName}
          </Text>
          <Text
            style={{
              color: colors.orange,
              fontSize: moderateScale(14),
              fontFamily: 'Arial-BoldMT',
            }}>
            Click to view more order details
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  navigateToOrderDetails(listKey, orderKey) {
    const {orders} = this.state;
    this.props.navigation.push('OrderDetails', {
      date: orders[listKey].orders[orderKey].date,
      items: orders[listKey].orders[orderKey].items,
      businessName: orders[listKey].orders[orderKey].businessName,
      totalCost: orders[listKey].orders[orderKey].totalCost,
      driver: orders[listKey].orders[orderKey].driverName,
      docId: orders[listKey].docId,
      orderKey,
    });
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    return (
      <View style={{flex: 1}}>
        <Heading navigation={this.props.navigation} defaultRow drawerNavigator>
          <Text style={localStyles.headingText}>Orders</Text>
        </Heading>
        <View
          style={{
            flex: 1,
            paddingBottom: verticalScale(17.92),
            justifyContent: this.state.orders[0].orders.length
              ? 'center'
              : 'flex-start',
          }}>
          <ScrollView
            key="parent"
            refreshControl={
              <RefreshControl
                tintColor={colors.orange}
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.loadOldOrders()}
              />
            }
            style={{flex: 1}}>
            <FlatList
              listKey="trackOrders"
              data={this.state.currentOrdersFullObj}
              renderItem={({item, index, separators}) => {
                return (
                  <TrackOrderComponent
                    navigation={this.props.navigation}
                    businessLocation={item.orderInfo.businessLocation}
                    numItems={item.orderInfo.items.length}
                    businessName={item.orderInfo.items[0].item.businessName}
                    driver={item.driver}
                    key={index}
                  />
                );
              }}
            />
            {this.state.orders[0].orders.length === 0 ? (
              <Text style={{textAlign: 'center', color: colors.grey}}>
                Any orders you've made will be logged and displayed here
              </Text>
            ) : (
              <FlatList
                listKey="lists"
                contentContainerStyle={{alignItems: 'center'}}
                style={{width: '100%'}}
                data={this.state.orders}
                renderItem={({item, index, separators}) => {
                  let listIndex = index;
                  return (
                    <FlatList
                      listKey={'items' + index}
                      data={item.orders}
                      renderItem={({item, index, separators}) =>
                        this.createOrder(
                          item.items.length,
                          item.totalCost,
                          item.driverName,
                          listIndex,
                          index,
                          item.date,
                          item.businessName,
                        )
                      }
                    />
                  );
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
class OrderDetails extends Component {
  state = {
    productItems: [],
    driverName: '',
    date: '',
    cost: 0,
    isLoading: true,
  };
  async componentDidMount() {
    const {driver, date, items, totalCost} = this.props.navigation.state.params;
    let tempProductItems = [];
    for (var i = 0; i < items.length; i++) {
      await FirebaseFunctions.getProduct(items[i].itemId)
        .then(async response => {
          tempProductItems.push({
            item: response.data(),
            imagePath: {
              uri: await FirebaseFunctions.getProductImg(
                response.data().businessId,
                items[i].itemId,
              ),
            },
            itemId: items[i].itemId,
            quantity: items[i].quantity,
          });
        })
        .catch(error => {
          tempProductItems.push({
            deleted: true,
          });
        });
    }
    this.setState({
      productItems: tempProductItems,
      driverName: driver,
      date: date,
      isLoading: false,
      totalCost: totalCost,
    });
  }
  render() {
    if (this.state.isLoading) {
      return <SplashScreen />;
    }
    const {date, driverName, totalCost} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Heading
          style={{justifyContent: 'space-between', alignItems: 'center'}}
          navigation={this.props.navigation}>
          <TouchableOpacity>
            <Text
              onPress={() =>
                this.props.navigation.push('Report', {
                  docId: this.props.navigation.state.params.docId,
                  orderKey: this.props.navigation.state.params.orderKey,
                  isOrder: true,
                })
              }
              style={localStyles.detailsHeadingText}>
              Report
            </Text>
          </TouchableOpacity>
        </Heading>
        <ScrollView>
          <View style={localStyles.basicInfoView}>
            <View style={localStyles.infoWrapper}>
              <Text style={localStyles.detailsText}>Date: {date}</Text>
            </View>
            <View style={localStyles.infoWrapper}>
              <Text style={localStyles.detailsText}>Driver: {driverName}</Text>
            </View>
          </View>
          <View style={localStyles.infoWrapper}>
            <Text style={localStyles.detailsText}>
              Total Cost: ${totalCost}
            </Text>
          </View>
          <View>
            <Text
              style={[
                localStyles.detailsText,
                {marginLeft: 5, color: colors.black, paddingBottom: 5},
              ]}>
              Items:
            </Text>
            <FlatList
              data={this.state.productItems}
              contentContainerStyle={{alignItems: 'center'}}
              style={{alignSelf: 'center', width: '100%'}}
              renderItem={({item, index, separators}) => (
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderBottomColor: colors.black,
                  }}>
                  {item.deleted ? (
                    <ProductItem isHorizontal deleted />
                  ) : (
                    <ProductItem
                      key={index}
                      addable
                      isHorizontal
                      inStock={item.item.inStock}
                      numReviews={item.item.numReviews}
                      businessName={item.item.businessName}
                      businessId={item.item.businessId}
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
                  )}
                  {item.deleted ? null : (
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
                  )}
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const localStyles = StyleSheet.create({
  itemsViewStyle: {
    paddingLeft: scale(15.86),
    marginTop: verticalScale(34.33),
  },
  basicInfoView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(18.25),
  },
  detailsHeadingText: {
    color: '#ff0000',
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    marginRight: verticalScale(24.31),
  },
  quantityText: {
    textAlign: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(16),
    alignSelf: 'center',
    marginBottom: 5,
  },
  pastOrderObjView: {
    alignSelf: 'center',
    backgroundColor: colors.black,
    borderRadius: 15,
    padding: scale(12), //SCCCALLELED
    width: scale(403.65),
    height: verticalScale(208.37),
    shadowOpacity: 0.5,
    marginTop: verticalScale(12.16),
    shadowOffset: {height: 3, width: 3},
    shadowRadius: 1,
    shadowColor: colors.black,
    elevation: scale(5.4), //SCCCALLELED
    backgroundColor: colors.black,
  },
  headingText: {
    width: scale(100),
    textAlign: 'center',
    paddingTop: verticalScale(12.16),
    color: colors.white,
    paddingBottom: verticalScale(12.16),
    paddingLeft: scale(5.28),
    paddingRight: scale(5.28),
    alignSelf: 'center',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(25),
  },
  numOrdersTxt: {
    marginLeft: scale(10.56),
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    marginTop: verticalScale(12.16),
    marginBottom: verticalScale(12.16),
  },
  headingStyle: {
    paddingTop: verticalScale(12.16),
    paddingBottom: verticalScale(12.16),
  },
  detailsText: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
    color: colors.white,
  },
  infoWrapper: {
    ...styles.next,
    marginRight: 0,
    padding: 9,
    paddingRight: 9,
    paddingLeft: 9,
    backgroundColor: colors.black,
  },
});
export {PastOrders, OrderDetails};
