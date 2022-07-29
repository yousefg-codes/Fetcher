import React, {useEffect, useState} from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import FirebaseFunctions from '../../config/Firebase/FirebaseFunctions';
import PastOrderObj from '../../components/GlobalComponents/PastOrderObj';
import styles from '../../config/Styles/EarningOrdersScreenStyle';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import colors from '../../config/Styles/colors';

export default (EarningOrdersScreen = props => {
  const [pastOrders, setPastOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const asyncUseEffect = async () => {
    let tempPastOrders = [];
    //console.log(props.route.params.pastOrders.length);
    for (var i = 0; i < props.route.params.pastOrders.length; i++) {
      let specificPastOrders = await FirebaseFunctions.getSpecificPastOrdersFromDoc(
        props.route.params.pastOrders[i].docId,
        props.route.params.pastOrders[i].orderIndecies,
      );
      //console.log(specificPastOrders);
      if (i === 0) {
        tempPastOrders = specificPastOrders;
      } else {
        tempPastOrders = tempPastOrders.concat(specificPastOrders);
      }
    }
    //console.log(tempPastOrders)
    setPastOrders(tempPastOrders);
    setIsLoading(false);
  };
  useEffect(() => {
    asyncUseEffect();
  }, []);
  const navigateToOrderDetails = (listKey, orderIndex) => {
    props.navigation.push('OrderDetails', {
      date: pastOrders[orderIndex].date,
      earning: pastOrders[orderIndex].earning,
      items: pastOrders[orderIndex].items,
      businessName: pastOrders[orderIndex].businessName,
      totalCost: pastOrders[orderIndex].totalCost,
      customerName: pastOrders[orderIndex].customerName,
    });
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: scale(414),
            height: verticalScale(44.8),
            backgroundColor: colors.darkGrey,
          }}
        />
        <FlatList
          data={[1, 2, 3]}
          renderItem={({item, index, separators}) => (
            <View style={styles.loadingPastOrder} />
          )}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Heading navigation={props.navigation} onlyArrow={true} />
      <ScrollView style={styles.scrollView}>
        {pastOrders.map((item, index) => (
          <PastOrderObj
            key={index}
            numItems={item.items.length}
            totalCost={item.totalCost}
            earning={item.earning}
            customerName={item.customerName}
            listIndex={-1}
            orderIndex={index}
            date={item.date}
            businessName={item.businessName}
            navigateToOrderDetails={(listKey, orderKey) =>
              navigateToOrderDetails(listKey, orderKey)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
});
