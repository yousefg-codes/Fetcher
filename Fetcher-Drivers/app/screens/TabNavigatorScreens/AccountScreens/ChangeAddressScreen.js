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
import {displayAwaitingOrder} from '../../../components/GlobalComponents/AwaitingOrderComponent';

export default (ChangeAddressScreen = props => {
  return (
    <View style={styles.container}>
      <Heading
        onArrowPress={() => {
          if (GlobalStateHandler.currentUserData.isInDrivingSession) {
            displayAwaitingOrder();
          }
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
          {/* {this.props.isEditing ? (
                    <View style={{flexDirection: 'row'}}>
                        <View
                        style={{width: scale(8.28), backgroundColor: colors.white}}
                        />
                        <View style={{width: (1 * dimensions.width) / 7, flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={() => this.props.onPressDelete()}
                            style={[
                            styles.accountSettings,
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                width:
                                dimensions.width -
                                ((7 * dimensions.width) / 8 + scale(24.84)),
                                height: verticalScale(74.66),
                                flex: 3,
                            },
                            ]}
                            disabled={!this.props.isEditing}>
                            {this.props.isEditing && !this.props.isNewAddress ? (
                            <Icon name="delete" size={fontScale * 30} color="#ff0000" />
                            ) : null}
                        </TouchableOpacity>
                        </View>
                    </View>
                    ) : null} */}
        </View>
      </View>
    </View>
  );
});
