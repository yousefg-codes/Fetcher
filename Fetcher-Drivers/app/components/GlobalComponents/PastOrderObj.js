import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import styles from '../../config/Styles/PastOrderObjStyle'
import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions'
import colors from '../../config/Styles/colors'

export default PastOrderObj = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          //console.warn(props.listIndex)
          props.navigateToOrderDetails(props.listIndex, props.orderIndex)
        }}
        key={props.listIndex * (props.orderIndex + 1)}
        style={[styles.pastOrderObjView, 
            props.homeScreen ? {
                height: verticalScale(215.04),
                width: scale(380.88)
            } : {

            }
        ]}>
        <View style={{paddingLeft: scale(2)}}>
          <Text
            style={{
              marginTop: 5,
              marginBottom: verticalScale(6.08),
              fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
              color: colors.white,
            }}>
            Number of Items Ordered: {props.numItems}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
                marginBottom: verticalScale(6.08),
                color: colors.white,
              }}>
              Total Order Cost: ${props.totalCost}
            </Text>
            <Text
              style={{
                fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
                marginBottom: verticalScale(6.08),
                color: colors.white,
              }}>
              Date: {props.date}
            </Text>
          </View>
            <Text
                style={{
                marginBottom: verticalScale(6.08),
                fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
                color: colors.white,
                }}>
                Customer: {props.customerName}
            </Text>
            <Text
                style={{
                marginBottom: verticalScale(6.08),
                fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
                color: colors.white,
                }}>
                Business: {props.businessName}
            </Text>
          <Text
              style={{
                fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
                marginBottom: verticalScale(6.08),
                color: colors.white,
              }}>
              Earning: ${props.earning}
            </Text>
          <Text style={{color: colors.orange, fontSize: moderateScale(14), fontFamily: 'Arial-BoldMT'}}>
            Click to view more order details
          </Text>
        </View>
      </TouchableOpacity>
    );
  }