import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Animated} from 'react-native';
import styles from '../../../config/Styles/ChangeAddressScreenStyle';
import {Icon} from 'react-native-elements';
import fontStyles from '../../../config/Styles/fontStyles';
import Heading from '../../../components/GlobalComponents/Heading';
import colors from '../../../config/Styles/colors';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../../config/Styles/dimensions';
import GlobalStateHandler from '../../../config/GlobalHandler/GlobalStateHandler';

export default (ChangeBankNumbersScreen = props => {
  return (
    <View style={styles.container}>
      <Heading
        onArrowPress={() => {
          props.navigation.navigate('mainDrawerNavigator');
        }}
        navigation={props.navigation}
        onlyArrow={true}
      />
      <View style={{paddingTop: verticalScale(8.96)}}>
        <View style={styles.addressComponentView}>
          <Animated.View style={styles.animatedContainer}>
            <View onPress={() => {}} style={styles.accountSettings}>
              <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                <View style={styles.starView}>
                  <Icon name="star" color={colors.black} />
                </View>
                <Text style={styles.accountSettingsText}>
                  {GlobalStateHandler.currentUserData.address}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('AddressScreen', {
                    isAddition: true,
                  });
                }}
                style={styles.editContainer}>
                <Icon type="material" name="edit" color={colors.black} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
        <View style={styles.addressComponentView}>
          <Animated.View style={styles.animatedContainer}>
            <View onPress={() => {}} style={styles.accountSettings}>
              <View style={{flexDirection: 'row', overflow: 'hidden'}}>
                <View style={styles.starView}>
                  <Icon name="star" color={colors.black} />
                </View>
                <Text style={styles.accountSettingsText}>
                  {GlobalStateHandler.currentUserData.address}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('AddressScreen', {
                    isAddition: true,
                  });
                }}
                style={styles.editContainer}>
                <Icon type="material" name="edit" color={colors.black} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
});
