import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Animated,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MapView from '../../components/MapComponents/Map';
import styles from '../../config/Styles/HomeScreenStyle';
import {
  ViewOrderInfoComponent,
  displayClickHereToViewOrder,
} from '../../components/GlobalComponents/ViewOrderInfoComponent';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import DrawerOpener from '../../components/GlobalComponents/DrawerOpener';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import {Icon} from 'react-native-elements';
import colors from '../../config/Styles/colors';
import {showUntilVerified} from '../../components/GlobalComponents/UntilVerifiedPopUp';
import {
  displayAwaitingOrder,
  hideAwaitingOrder,
} from '../../components/GlobalComponents/AwaitingOrderComponent';
import {LineChart} from 'react-native-chart-kit';
import {CurrentRenderContext} from '@react-navigation/native';
import PastOrderObj from '../../components/GlobalComponents/PastOrderObj';
import SignUpHandler from '../../config/SignUpHandler/SignUpHandler';
import {ProductItem} from '../../components/GlobalComponents/ProductItem';
import {showMessage} from 'react-native-flash-message';
import {displayNewOrder} from '../../components/GlobalComponents/NewOrderComponent';
import KeepAwake from 'react-native-keep-awake';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}
export default (HomeScreen = props => {
  const [didUseEffect, setDidUseEffect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [earnings, setEarnings] = useState([]);
  // const [orders, setOrders] = useState([])
  const [carryingOutOrder, setCarryingOutOrder] = useState(false);
  const [displayedEarnings, setDisplayedEarnings] = useState([]);
  const [bottomViewEnlargened, setBottomViewEnlargened] = useState(false);
  const [isInDrivingSession, setIsInDrivingSession] = useState(false);
  const [transformation, setTransformation] = useState(new Animated.Value(0));
  const forceUpdate = useForceUpdate();
  const bottomViewHeight = transformation.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(256), verticalScale(716.8)],
  });
  const bottomViewWidth = transformation.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(393.3), scale(403.65)],
  });
  const leftMargin = transformation.interpolate({
    inputRange: [0, 1],
    outputRange: [scale(10.35), scale(5.175)],
  });
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
  //   copy.push({docId, orders: docData.orders});
  //   setOrders(copy);
  // }
  earningsRefresh = (docData, docId) => {
    let copy = earnings.slice();
    //console.log(earnings)
    for (var i = 0; i < earnings.length; i++) {
      //console.log(docId+' '+earnings[i].docId)
      if (docId === earnings[i].docId) {
        copy[i] = {docId, earnings: docData.earnings};
        setEarnings(copy);
        return;
      }
    }
  };
  const toggleDrivingState = () => {
    FirebaseFunctions.toggleDrivingSession(!isInDrivingSession);
    if (!isInDrivingSession) {
      displayAwaitingOrder();
    } else {
      hideAwaitingOrder();
    }
    GlobalStateHandler.currentUserData.isInDrivingSession = !isInDrivingSession;
    setIsInDrivingSession(!isInDrivingSession);
  };
  earningsAddition = (docData, docId, isOldDoc) => {
    let copy = earnings.slice();
    if (isOldDoc) {
      copy.unshift({docId, earnings: docData.earnings});
      setEarnings(copy);
      return;
    }
    copy.push({docId, earnings: docData.earnings});
    setEarnings(copy);
  };
  const asyncUseEffect = async () => {
    //console.error('LISTENERS ADDED AGAIN');
    GlobalStateHandler.eventEmitter.addListener('carryingOutOrder', () => {
      setCarryingOutOrder(true);
    });
    GlobalStateHandler.eventEmitter.addListener('doneCarryingOut', () => {
      setCarryingOutOrder(false);
    });
    GlobalStateHandler.eventEmitter.addListener('reload', () => {
      forceUpdate();
      //console.warn('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    });
    GlobalStateHandler.eventEmitter.addListener('inDriving', async () => {
      setIsInDrivingSession(true);
      KeepAwake.activate();
    });
    GlobalStateHandler.eventEmitter.addListener('notInDriving', async () => {
      setIsInDrivingSession(false);
      KeepAwake.deactivate();
    });
    let shouldShowAwaitingOrder = false;
    GlobalStateHandler.currentUserData = await GlobalStateHandler.getCurrentUserData();
    setIsInDrivingSession(
      GlobalStateHandler.currentUserData.isInDrivingSession,
    );
    setCarryingOutOrder(
      GlobalStateHandler.currentUserData.currentOrders.length > 0,
    );
    GlobalStateHandler.eventEmitter.emit('signIn');
    if (!GlobalStateHandler.currentUserData.verified) {
      GlobalStateHandler.eventEmitter.addListener('verified', () => {
        forceUpdate();
      });
    }
    //console.log(GlobalStateHandler.orders);
    if (GlobalStateHandler.currentUserData.isInDrivingSession) {
      GlobalStateHandler.isInDrivingSession = true;
      if (GlobalStateHandler.currentUserData.currentOrders.length === 0) {
        shouldShowAwaitingOrder = true;
      } else {
        GlobalStateHandler.continueFirstOrder = true;
      }
    }
    FirebaseFunctions.updateUserData();
    if (!GlobalStateHandler.currentUserData.verified) {
      showUntilVerified('');
    }
    let lastEarningsIndex =
      GlobalStateHandler.currentUserData.lastEarningsIndex;
    await FirebaseFunctions.loadEarnings(
      lastEarningsIndex,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => earningsAddition(docData, docId, isOldDoc),
      false,
    );
    if (lastEarningsIndex - 1 > -1) {
      await FirebaseFunctions.loadEarnings(
        lastEarningsIndex - 1,
        (docData, docId) => earningsRefresh(docData, docId),
        (docData, docId, isOldDoc) =>
          earningsAddition(docData, docId, isOldDoc),
        true,
      );
    }
    FirebaseFunctions.checkForNewEarningsDocs(
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => earningsAddition(docData, docId, isOldDoc),
    );
    await GlobalStateHandler.initPastOrders();
    GlobalStateHandler.eventEmitter.addListener('pastOrdersUpdate', () => {
      const orders = GlobalStateHandler.orders;
      if (
        orders.length === 0 ||
        orders[orders.length - 1].orders.length === 0
      ) {
        return;
      }
      let lastListIndex = orders.length - 1;
      //console.warn(lastListIndex);
      let lastIndex = orders[lastListIndex].orders.length - 1;
      let toBeDisplayed = [
        {
          ...orders[lastListIndex].orders[
            orders[lastListIndex].orders.length - 1
          ],
          listIndex: lastListIndex,
        },
      ];
      let currElement = toBeDisplayed[0];
      for (var i = 0; i < 2; i++) {
        if (lastIndex !== 0 || lastListIndex !== 0) {
          if (lastIndex === 0) {
            lastListIndex--;
            lastIndex = orders[lastListIndex].orders.length - 1;
          } else {
            lastIndex--;
          }
        } else {
          break;
        }
        currElement = orders[lastListIndex].orders[lastIndex];
        toBeDisplayed.push({...currElement, listIndex: lastListIndex});
      }
      setDisplayedOrders(toBeDisplayed);
    });
    // let lastOrderIndex = GlobalStateHandler.currentUserData.lastOrderIndex;
    // await FirebaseFunctions.loadPastOrder(lastOrderIndex, (docData, docId) => pastOrdersRefresh(docData, docId), (docData, docId, isOldDoc) => addToPastOrders(docData, docId, isOldDoc), false)
    // //setOldestDocId(lastOrderIndex)
    // FirebaseFunctions.checkForNewPastOrderDocs((docData, docId) => pastOrdersRefresh(docData, docId), (docData, docId, isOldDoc) => addToPastOrders(docData, docId, isOldDoc));
    if (shouldShowAwaitingOrder) {
      displayAwaitingOrder();
    }
  };

  const getYearOutOfDate = date => {
    return parseInt(date.substr(date.length - 4, 4));
  };
  const getDayOutOfDate = date => {
    return parseInt(date.substring(date.indexOf('/'), date.length - 5));
  };
  const getMonthOutOfDate = date => {
    //console.warn(new Date().getDay());
    return parseInt(date.substring(0, date.indexOf('/')));
  };
  const fixDate = dateString => {
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
  };
  useEffect(() => {
    if (!didUseEffect) {
      GlobalStateHandler.homeScreenRef = this;
      asyncUseEffect();
      //console.log(didUseEffect)
      setDidUseEffect(true);
    } else {
      let today = new Date();
      let currWeek = [];
      for (let i = 0; i < today.getDay(); i++) {
        currWeek.unshift(
          fixDate(
            new Date(today - 60 * 24 * (i + 1) * 60000).toLocaleDateString(
              'en-US',
            ),
          ),
        );
      }
      currWeek.push(fixDate(today.toLocaleDateString('en-US')));
      let lastSeven = [];
      for (
        let i = earnings[earnings.length - 1].earnings.length - 1;
        i >= 0;
        i--
      ) {
        lastSeven.unshift(earnings[earnings.length - 1].earnings[i]);
      }
      //console.log(earnings.length - 2);
      if (lastSeven.length < 7 && earnings[earnings.length - 2] !== undefined) {
        for (
          let i = earnings[earnings.length - 2].earnings.length - 1;
          i >= earnings[earnings.length - 1].earnings.length;
          i--
        ) {
          lastSeven.unshift(earnings[earnings.length - 2].earnings[i]);
        }
      }
      //console.warn(lastSeven);
      let displayedEarnings = [0, 0, 0, 0, 0, 0, 0];
      let j = 0;
      currWeek.forEach(day => {
        lastSeven.forEach(element => {
          //console.log(day);
          //console.log(element.date);
          if (day === element.date) {
            displayedEarnings[j] = element.amount;
          }
        });
        j++;
      });
      //console.warn(currWeek);
      setDisplayedEarnings(displayedEarnings);
      setIsLoading(false);
    }
  }, [earnings]);

  navigateToOrderDetails = (listKey, orderKey) => {
    const orders = GlobalStateHandler.orders;
    //console.warn(listKey);
    props.navigation.push('OrderDetails', {
      date: orders[listKey].orders[orderKey].date,
      items: orders[listKey].orders[orderKey].items,
      businessName: orders[listKey].orders[orderKey].businessName,
      totalCost: orders[listKey].orders[orderKey].totalCost,
      driver: orders[listKey].orders[orderKey].driverName,
      customerName: orders[listKey].orders[orderKey].customerName,
      earning: orders[listKey].orders[orderKey].earning,
    });
  };
  if (isLoading) {
    return (
      <View style={{...styles.container, backgroundColor: colors.grey}}>
        <View style={{flex: 1, backgroundColor: colors.white}} />
        <DrawerOpener isLoading />
        <View
          style={[
            styles.bottomView,
            {
              height: verticalScale(256),
              width: scale(393.3),
              left: scale(10.35),
              backgroundColor: colors.grey,
              borderColor: colors.grey,
            },
          ]}>
          <View style={styles.bottomViewHeaderContainer} />
          <ScrollView />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView isInDrivingSession={isInDrivingSession} />
      {carryingOutOrder ? null : (
        <Animated.View
          style={[
            styles.bottomView,
            {
              height: bottomViewHeight,
              width: bottomViewWidth,
              left: leftMargin,
            },
          ]}>
          <View style={styles.bottomViewHeaderContainer}>
            <TouchableOpacity
              onPress={() => {
                //console.log(transformation);
                //console.log(bottomViewEnlargened);
                if (!bottomViewEnlargened) {
                  Animated.timing(transformation, {
                    useNativeDriver: false,
                    duration: 500,
                    toValue: 1,
                  }).start(({finished}) => {
                    setBottomViewEnlargened(true);
                  });
                } else {
                  Animated.timing(transformation, {
                    useNativeDriver: false,
                    duration: 500,
                    toValue: 0,
                  }).start(() => {
                    setBottomViewEnlargened(false);
                  });
                }
              }}>
              <View style={styles.arrowContainer}>
                <View style={styles.firstIconContainer}>
                  <Icon
                    type="antdesign"
                    size={scale(14)}
                    style={{transform: [{rotate: '-45deg'}]}}
                    color={colors.goodBlue}
                    name={bottomViewEnlargened ? 'arrowleft' : 'arrowright'}
                  />
                </View>
                <View style={styles.secondIconContainer}>
                  <Icon
                    type="antdesign"
                    size={scale(14)}
                    style={{transform: [{rotate: '-45deg'}]}}
                    color={colors.goodBlue}
                    name={bottomViewEnlargened ? 'arrowright' : 'arrowleft'}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={{alignSelf: 'center', width: '100%'}}>
              <Text style={styles.miniTitles}>Your Earnings this week: </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('EarningsScreen');
                }}
                style={styles.graphContainer}>
                <LineChart
                  data={{
                    labels: [
                      'Sun.',
                      'Mon.',
                      'Tue.',
                      'Wed.',
                      'Thurs.',
                      'Fri.',
                      'Sat.',
                    ],
                    datasets: [
                      {
                        data: displayedEarnings,
                      },
                    ],
                  }}
                  width={scale(372.6)} // from react-native
                  height={verticalScale(207)}
                  yAxisLabel="$"
                  fromZero
                  style={{
                    borderWidth: 1,
                    borderColor: colors.white,
                    borderRadius: 16,
                  }}
                  chartConfig={{
                    backgroundColor: colors.white,
                    backgroundGradientFrom: colors.white,
                    backgroundGradientTo: colors.white,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: colors.orange,
                    },
                    propsForLabels: {
                      fontSize: moderateScale(11),
                    },
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{width: '100%'}}>
              <Text
                style={[styles.miniTitles, {marginTop: verticalScale(8.96)}]}>
                Recent Orders:
              </Text>
              {displayedOrders.map((item, index) => (
                <PastOrderObj
                  homeScreen
                  key={item.listIndex + ' ' + index}
                  numItems={item.items.length}
                  totalCost={item.totalCost}
                  customerName={item.customerName}
                  listIndex={item.descriptionlistIndex}
                  earning={item.earning}
                  orderIndex={index}
                  date={item.date}
                  businessName={item.businessName}
                  navigateToOrderDetails={(listKey, orderKey) =>
                    navigateToOrderDetails(listKey, orderKey)
                  }
                />
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}
      {carryingOutOrder ? null : <DrawerOpener />}
      {carryingOutOrder ? null : (
        <TouchableOpacity
          disabled={
            carryingOutOrder || !GlobalStateHandler.currentUserData.verified
          }
          onPress={() => {
            if (!GlobalStateHandler.currentUserData.isInDrivingSession) {
              showMessage({
                message: 'Notice',
                description:
                  "Don't forget to end the driving session when you're done, closing the app does not end it",
                type: 'warning',
                duration: 3000,
                position: 'top',
              });
              setTimeout(() => {
                toggleDrivingState();
              }, 3700);
              return;
            }
            toggleDrivingState();
          }}
          style={[
            styles.drivingSessionBtn,
            isInDrivingSession
              ? carryingOutOrder
                ? {
                    borderColor: colors.grey,
                    backgroundColor: colors.grey,
                  }
                : {
                    borderColor: colors.red,
                    backgroundColor: colors.red,
                  }
              : !GlobalStateHandler.currentUserData.verified
              ? {
                  borderColor: colors.grey,
                  backgroundColor: colors.grey,
                }
              : {
                  borderColor: colors.green,
                  backgroundColor: colors.green,
                },
          ]}>
          <Text style={styles.drivingSessionBtnText}>
            {isInDrivingSession ? 'Stop' : 'Go'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
