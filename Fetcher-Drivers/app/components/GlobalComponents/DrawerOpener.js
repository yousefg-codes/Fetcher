import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Animated, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import styles from '../../config/Styles/DrawerOpenerStyle';
import {hideAwaitingOrder} from './AwaitingOrderComponent';
import colors from '../../config/Styles/colors';

export default (DrawerOpener = props => {
  const navigation = useNavigation();
  const [rotation, setRotation] = useState(new Animated.Value(0));
  const onPress = () => {
    // Animated.timing(rotation, {
    //   toValue: 1,
    //   useNativeDriver: true,
    //   duration: 1000,
    // }).start();
    //setTimeout(() => {
    setRotation(new Animated.Value(0));
    navigation.dispatch(DrawerActions.openDrawer());
    hideAwaitingOrder();
    //}, 400);
  };
  const interpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <TouchableOpacity
      disabled={props.isLoading}
      style={[
        styles.touchableOpacity,
        props.isLoading
          ? {backgroundColor: colors.grey, borderColor: colors.grey}
          : {},
      ]}
      onPress={() => onPress()}>
      {props.isLoading ? null : (
        <Animated.View style={{transform: [{rotate: interpolate}]}}>
          <Icon type="feather" name="menu" />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
});
