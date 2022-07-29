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
import styles from '../../config/Styles/EarningsScreenStyle';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import {LineChart} from 'react-native-chart-kit';
import PastEarning from '../../components/GlobalComponents/PastEarning';
import Heading from '../../components/GlobalComponents/Heading';
import fontStyles from '../../config/Styles/fontStyles';

export const EarningsScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [didUseEffect, setDidUseEffect] = useState(false);
  const [displayedEarnings, setDisplayedEarnings] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [oldestDocId, setOldestDocId] = useState(-1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  earningsRefresh = (docData, docId) => {
    let copy = earnings.slice();
    for (var i = 0; i < earnings.length; i++) {
      if (docId === earnings[i].docId) {
        copy[i] = {docId, earnings: docData.earnings};
        setEarnings(copy);
        return;
      }
    }
  };
  addToEarnings = (docData, docId, isOldDoc) => {
    let copy = earnings.slice();
    if (docId < oldestDocId) {
      setOldestDocId(docId);
    }
    if (isOldDoc) {
      //console.log('OH HEY')
      copy.unshift({docId, earnings: docData.earnings});
      setEarnings(copy);
      return;
    }
    //console.log(docData)
    copy.push({docId, earnings: docData.earnings});
    setEarnings(copy);
    setIsLoading(false);
  };
  const getYearOutOfDate = date => {
    return parseInt(date.substr(date.length - 4, 4));
  };
  const getDayOutOfDate = date => {
    return parseInt(date.substring(date.indexOf('/'), date.length - 5));
  };
  const getMonthOutOfDate = date => {
    return parseInt(date.substring(0, date.indexOf('/')));
  };
  const asyncUseEffect = async () => {
    let lastEarningsIndex =
      GlobalStateHandler.currentUserData.lastEarningsIndex;
    await FirebaseFunctions.loadEarnings(
      lastEarningsIndex,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      false,
    );
    setOldestDocId(lastEarningsIndex);
    FirebaseFunctions.checkForNewEarningsDocs(
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
    );
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
      asyncUseEffect();
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
      setDisplayedEarnings(displayedEarnings);
      setIsLoading(false);
    }
  }, [earnings]);

  const loadOldEarnings = async () => {
    setIsRefreshing(true);
    if (oldestDocId - 1 < 0) {
      setIsRefreshing(false);
      return;
    }
    await FirebaseFunctions.loadEarnings(
      oldestDocId - 1,
      (docData, docId) => earningsRefresh(docData, docId),
      (docData, docId, isOldDoc) => addToEarnings(docData, docId, isOldDoc),
      true,
    );
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Heading navigation={props.navigation} onlyArrow={true} />
      <View
        style={{
          flex: 1,
          paddingBottom: verticalScale(17.92),
          justifyContent: earnings[0].earnings.length ? 'center' : 'flex-start',
        }}>
        <ScrollView
          key="parent"
          refreshControl={
            <RefreshControl
              tintColor={colors.orange}
              refreshing={isRefreshing}
              onRefresh={() => loadOldEarnings()}
            />
          }
          contentContainerStyle={{
            flexGrow: earnings[0].earnings.length === 0 ? 1 : 0,
            alignItems: 'center',
            justifyContent:
              earnings[0].earnings.length === 0 ? 'center' : 'flex-start',
          }}
          style={{flex: 1, paddingTop: verticalScale(17.92)}}>
          <Text
            style={{
              ...fontStyles.normalFont,
              fontSize: moderateScale(16),
              fontWeight: 'bold',
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            Payouts occur every 4-6 Days {'\n'} (Business and Non-Business days)
          </Text>
          {earnings[0].earnings.length === 0 ? (
            <Text style={{textAlign: 'center', color: colors.grey}}>
              Any earnings you've made will be logged and displayed here
            </Text>
          ) : (
            <View>
              <View style={styles.graphContainer}>
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
                  height={verticalScale(205)}
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
              </View>
              <View style={{height: verticalScale(8.96)}} />
              {earnings.map((item, index) => {
                let listIndex = index;
                return item.earnings.map((item, index, separators) => (
                  <PastEarning
                    key={index}
                    fullDate={item.date}
                    amount={item.amount}
                    onPress={() => {
                      props.navigation.push('EarningOrdersScreen', {
                        pastOrders: item.orders,
                      });
                    }}
                  />
                ));
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};
