import React, {useEffect, useState} from 'react';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
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
import SplashScreen from '../../components/GlobalComponents/SplashScreen';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import colors from '../../config/Styles/colors';
import {ProductItem} from '../../components/GlobalComponents/ProductItem';
import styles from '../../config/Styles/PastOrdersStyle';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';

export const PastOrders = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderComponents, setOrderComponents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [oldestDocId, setOldestDocId] = useState(-1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // pastOrdersRefresh = (docData, docId) => {
  //   let copy = orders.slice();
  //   for(var i = 0; i < orders.length; i++){
  //     if(docId === orders[i].docId){
  //       copy[i] = {docId, orders: docData.orders}
  //       setOrders(copy)
  //       return;
  //     }
  //   }
  // }
  // addToPastOrders = (docData, docId, isOldDoc) => {
  //   let copy = orders.slice();
  //   if(docId < oldestDocId){
  //     setOldestDocId(docId)
  //   }
  //   if(isOldDoc){
  //     copy.unshift({docId, orders: docData.orders});
  //     setOrders(copy)
  //     return
  //   }
  //   copy.push({docId, orders: docData.orders});
  //   setOrders(copy);
  //   setIsLoading(false)
  // }
  // const asyncUseEffect = async () => {
  //   let lastOrderIndex = GlobalStateHandler.currentUserData.lastOrderIndex;
  //   await FirebaseFunctions.loadPastOrder(lastOrderIndex, (docData, docId) => pastOrdersRefresh(docData, docId), (docData, docId, isOldDoc) => addToPastOrders(docData, docId, isOldDoc), false)
  //   setOldestDocId(lastOrderIndex)
  //   FirebaseFunctions.checkForNewPastOrderDocs((docData, docId) => pastOrdersRefresh(docData, docId), (docData, docId, isOldDoc) => addToPastOrders(docData, docId, isOldDoc));
  // }
  useEffect(() => {
    setOrders(GlobalStateHandler.orders);
    //console.warn(GlobalStateHandler.orders);
    //console.error('LISTENERS ADDED AGAIN');

    GlobalStateHandler.eventEmitter.addListener('pastOrdersUpdate', () => {
      setOrders(GlobalStateHandler.orders);
      //console.warn(GlobalStateHandler.orders);
    });
    setIsLoading(false);
  }, []);

  const loadOldOrders = async () => {
    setIsRefreshing(true);
    await GlobalStateHandler.loadOldOrders();
    setIsRefreshing(false);
  };

  const navigateToOrderDetails = (listKey, orderKey) => {
    //console.warn(orders[listKey]);
    props.navigation.push('OrderDetails', {
      date: orders[listKey].orders[orderKey].date,
      earning: orders[listKey].orders[orderKey].earning,
      items: orders[listKey].orders[orderKey].items,
      businessName: orders[listKey].orders[orderKey].businessName,
      totalCost: orders[listKey].orders[orderKey].totalCost,
      customerName: orders[listKey].orders[orderKey].customerName,
    });
  };
  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          flex: 1,
          paddingBottom: verticalScale(17.92),
          justifyContent: orders[0].orders.length ? 'center' : 'flex-start',
        }}>
        {/* <ScrollView
          key="parent"
          refreshControl={
            <RefreshControl
              tintColor={colors.orange}
              refreshing={isRefreshing}
              onRefresh={() => loadOldOrders()}
            />
          }
          contentContainerStyle={{
            flexGrow: orders[0].orders.length === 0 ? 1 : 0,
            alignItems: 'center',
            justifyContent:
              orders[0].orders.length === 0 ? 'center' : 'flex-start',
          }}
          style={{
            flex: 1,
            paddingTop: verticalScale(53.76),
            paddingBottom: verticalScale(73.76),
          }}> */}
        {orders[0].orders.length === 0 ? (
          <Text
            style={{
              textAlign: 'center',
              color: colors.grey,
              paddingTop: verticalScale(63.76),
            }}>
            Any orders you've made will be logged and displayed here
          </Text>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={colors.orange}
                refreshing={isRefreshing}
                onRefresh={() => loadOldOrders()}
              />
            }
            listKey="lists"
            contentContainerStyle={{
              alignItems: 'center',
              paddingTop: verticalScale(65.76),
              paddingBottom: verticalScale(35.76),
            }}
            style={{width: '100%', paddingBottom: verticalScale(10)}}
            data={orders}
            renderItem={({item, index, separators}) => {
              let listIndex = index;
              return (
                <FlatList
                  listKey={'items' + index}
                  data={item.orders}
                  renderItem={({item, index, separators}) => (
                    <PastOrderObj
                      key={listIndex + ' ' + index}
                      numItems={item.items.length}
                      totalCost={item.totalCost}
                      customerName={item.customerName}
                      listIndex={listIndex}
                      earning={item.earning}
                      orderIndex={index}
                      date={item.date}
                      businessName={item.businessName}
                      navigateToOrderDetails={(listKey, orderKey) =>
                        navigateToOrderDetails(listKey, orderKey)
                      }
                    />
                  )}
                />
              );
            }}
          />
        )}
        {/* </ScrollView> */}
      </View>
      <DrawerOpener />
    </View>
  );
};
export const OrderDetails = props => {
  const [productItems, setProductItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [earning, setEarning] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState(0);

  const asyncUseEffect = async () => {
    const {customerName, date, earning, items, totalCost} = props.route.params;
    let tempProductItems = [];
    //console.warn(customerName);
    //console.warn(totalCost);
    for (var i = 0; i < items.length; i++) {
      let item = await FirebaseFunctions.getProduct(items[i].itemId);
      tempProductItems.push({
        item: item,
        imagePath: {
          uri: await FirebaseFunctions.getProductImg(
            item.businessId,
            items[i].itemId,
          ),
        },
        itemId: items[i].itemId,
        quantity: items[i].quantity,
      });
    }
    setCustomerName(customerName);
    setProductItems(tempProductItems);
    setDate(date);
    setEarning(earning);
    setTotalCost(totalCost);
    setIsLoading(false);
  };
  useEffect(() => {
    asyncUseEffect();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Heading
        onlyArrow
        style={{justifyContent: 'space-between', alignItems: 'center'}}
        navigation={props.navigation}>
        <TouchableOpacity>
          <Text
            onPress={() => props.navigation.push('ReportScreen')}
            style={styles.detailsHeadingText}>
            Report
          </Text>
        </TouchableOpacity>
      </Heading>
      <ScrollView>
        <View style={styles.basicInfoView}>
          <View style={styles.infoWrapper}>
            <Text style={styles.detailsText}>Date: {date}</Text>
          </View>
          <View style={styles.infoWrapper}>
            <Text style={styles.detailsText}>Customer: {customerName}</Text>
          </View>
        </View>
        <View style={styles.basicInfoView}>
          <View style={styles.infoWrapper}>
            <Text style={styles.detailsText}>Total Cost: ${totalCost}</Text>
          </View>
          <View style={styles.infoWrapper}>
            <Text style={styles.detailsText}>Earning: ${earning}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.detailsText,
              {marginLeft: 5, color: colors.black, paddingBottom: 5},
            ]}>
            Items:
          </Text>
          {productItems.map((item, index) => (
            <View
              style={{
                alignSelf: 'center',
                borderBottomWidth: 3,
                borderBottomColor: colors.black,
              }}>
              <ProductItem
                key={index}
                addable
                isHorizontal
                numReviews={item.item.numReviews}
                businessName={item.item.businessName}
                businessId={item.item.businessId}
                navigation={props.navigation}
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
                <Text style={styles.quantityText}>
                  quantity: {item.quantity}
                </Text>
                <Text style={styles.quantityText}>
                  cost per item: ${item.item.cost}
                </Text>
                <Text style={styles.quantityText}>
                  total cost: ${item.quantity * item.item.cost}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
