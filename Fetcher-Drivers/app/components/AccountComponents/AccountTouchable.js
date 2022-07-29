import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from '../../config/Styles/AccountTouchableStyle';
import {Icon} from 'react-native-elements';
import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions';
import colors from '../../config/Styles/colors';

export default (AccountTouchable = props => {
  return (
    <TouchableOpacity
      style={[
        props.override ? [styles.container, props.style] : styles.container,
        props.disabled ? {backgroundColor: colors.grey, borderColor: colors.grey} : {},
        props.isLoading ? {backgroundColor: colors.darkGrey, borderColor: colors.darkGrey} : {}
      ]}
      disabled={props.disabled || props.isLoading}
      onPress={() => props.onPress()}>
      {props.override || props.isLoading ? (
        props.children
      ) : (
        <View style={styles.nonOverrideView}>
          <Text style={styles.titleText}>{props.title}</Text>
          <Icon
            type="ionicon"
            style={{marginRight: 10}}
            name="ios-arrow-forward"
            size={moderateScale(24)}
            color={colors.white}
          />
        </View>
      )}
    </TouchableOpacity>
  );
});
