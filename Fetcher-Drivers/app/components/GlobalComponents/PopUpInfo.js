import React, {Component, useEffect, useState} from 'react';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import Modal from 'react-native-modal';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import colors from '../../config/Styles/colors';
import {color} from 'react-native-reanimated';
import {Icon} from 'react-native-elements';
import styles from '../../config/Styles/PopUpInfoStyle';

export default (PopUpInfo = props => {
  const [height, setHeight] = useState(new Animated.Value(verticalScale(8.96)));
  useEffect(() => {
    Animated.timing(height, {
      toValue: verticalScale(716.8),
      duration: 500,
      useNativeDriver: false,
    }).start();
    //console.log(height);
  }, []);
  const goDown = () => {
    Animated.timing(height, {
      toValue: verticalScale(8.96),
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      props.onBackdropPress();
    });
  };
  return (
    // <Modal style={{ width: '90%'}} isVisible={true} onBackdropPress={() => props.onBackdropPress()}>
    <View
      style={{
        top: 0,
        left: 0,
        position: 'absolute',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}>
      <Animated.View style={[styles.modalStyle, {height: height}]}>
        <View style={styles.topStyle}>
          <View style={{flex: 1}} />
          <Text style={styles.titleStyle}>{props.title}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <TouchableOpacity onPress={() => goDown()}>
              <Icon type="feather" name="x" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.oyster,
            borderWidth: 2,
            borderColor: colors.white,
          }}>
          <Text>{props.content}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
});
