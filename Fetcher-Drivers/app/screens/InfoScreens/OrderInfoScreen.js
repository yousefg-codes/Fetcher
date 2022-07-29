import React, {useState, useEffect} from 'react';
import {ScrollView, FlatList, View, Text, TouchableOpacity} from 'react-native';
import {ProductItem} from '../../components/GlobalComponents/ProductItem';
import styles from '../../config/Styles/OrderInfoScreenStyle';
import colors from '../../config/Styles/colors';
import Heading from '../../components/GlobalComponents/Heading';
import {
  displayClickHereToViewOrder,
  hideViewOrderInfoButton,
  displayClickHereToViewOrderNormal,
} from '../../components/GlobalComponents/ViewOrderInfoComponent';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import WaitingForCustomerConfirm from '../../components/GlobalComponents/WaitingForCustomerConfirm';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import {displayAwaitingOrder} from '../../components/GlobalComponents/AwaitingOrderComponent';
import {NavigationActions} from 'react-navigation';
import {CommonActions} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';

export default (OrderInfoScreen = props => {
  const [totalCost, setTotalCost] = useState(0);
  const [showWaitingForConfirm, setShowWaitingForConfirm] = useState(false);

  useEffect(() => {
    let totalCost = 0;
    props.route.params.orderDetails.orderInfo.items.forEach(element => {
      totalCost += element.quantity * element.item.cost;
    });
    setTotalCost(totalCost);
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* {showWaitingForConfirm 
            ? <WaitingForCustomerConfirm/>
            : null
          } */}
      <Heading
        onlyArrow
        style={{justifyContent: 'space-between'}}
        navigation={props.navigation}
        onArrowPress={() => {
          props.navigation.goBack(null);
          displayClickHereToViewOrderNormal({
            orderDetails: props.route.params.orderDetails,
            orderID: props.route.params.orderID,
          });
        }}>
        <TouchableOpacity
          disabled={
            GlobalStateHandler.currentUserData.currentLocation.latitude >
              props.route.params.orderDetails.orderInfo.customerLocation
                .latitude +
                0.25 / 69 &&
            GlobalStateHandler.currentUserData.currentLocation.latitude <
              props.route.params.orderDetails.orderInfo.customerLocation
                .latitude -
                0.25 / 69 &&
            GlobalStateHandler.currentUserData.currentLocation.longitude >
              props.route.params.orderDetails.orderInfo.customerLocation
                .longitude +
                0.25 / 69 &&
            GlobalStateHandler.currentUserData.currentLocation.longitude <
              props.route.params.orderDetails.orderInfo.customerLocation
                .longitude -
                0.25 / 69
          }
          style={styles.finishOrderBtn}
          onPress={async () => {
            // await FirebaseFunctions.updateOrderDocStatus(
            //   props.route.params.orderID,
            //   'DELIVERED',
            // );
            await FirebaseFunctions.finishCurrentOrder(
              props.route.params.orderID,
              props.route.params.orderDetails,
            );
            //console.warn(GlobalStateHandler.currentUserData.currentOrders);
            if (GlobalStateHandler.currentUserData.currentOrders.length > 0) {
              const orderDetails = await FirebaseFunctions.getOrder(
                GlobalStateHandler.currentUserData.currentOrders[0],
              );
              showMessage({
                message: 'Beginning Route',
                description: 'Starting Route for your next delivery',
                duration: 4000,
              });
              GlobalStateHandler.navigation.navigate('mainDrawerNavigator');
              GlobalStateHandler.eventEmitter.emit('moreOrders');
              setTimeout(
                () =>
                  displayClickHereToViewOrder({
                    orderDetails: orderDetails.data(),
                    orderID: orderDetails.id,
                  }),
                4100,
              );
            } else {
              GlobalStateHandler.navigation.navigate('mainDrawerNavigator');
              GlobalStateHandler.eventEmitter.emit('noMore');
              displayAwaitingOrder();
            }
          }}>
          <Text style={styles.finishOrderText}>Finish Order</Text>
        </TouchableOpacity>
      </Heading>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerForScrollView}>
        <Text style={styles.customerName}>
          Order Id: {props.route.params.orderID}
        </Text>
        <Text style={styles.customerName}>
          Business Address:{' '}
          {
            props.route.params.orderDetails.orderInfo.businessLocation
              .businessLocation
          }
        </Text>
        <Text style={styles.customerName}>
          Customer Address:{' '}
          {props.route.params.orderDetails.orderInfo.customerLocation.location}
        </Text>
        <Text style={styles.customerName}>
          Business Name:{' '}
          {
            props.route.params.orderDetails.orderInfo.businessLocation
              .businessName
          }
        </Text>
        <Text style={styles.customerName}>
          Customer Name:{' '}
          {props.route.params.orderDetails.orderInfo.customerName}
        </Text>
        {props.route.params.orderDetails.orderInfo.items.map(
          (item, index, separators) => (
            <View
              style={{borderBottomWidth: 3, borderBottomColor: colors.black}}>
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
          ),
        )}
      </ScrollView>
      <View style={styles.totalCostContainer}>
        <Text style={styles.totalCostText}>Total cost: ${totalCost}</Text>
      </View>
    </View>
  );
});
