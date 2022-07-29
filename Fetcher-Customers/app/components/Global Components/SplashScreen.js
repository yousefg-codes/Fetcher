import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'; import React, {useState, useEffect} from 'react';
import {Animated, Text, View, Dimensions} from 'react-native';
import {FetcherLogo} from '../../config/Image Requires/imageImports';
const FadeInEffect = props => {
  const spinAnim = new Animated.Value(0); // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinAnim]);
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <Animated.Image // Special animatable View
      source={FetcherLogo}
      style={{
        ...props.style,
        transform: [{rotate: spin}], // Bind opacity to animated value
      }}>
      {props.children}
    </Animated.Image>
  );
};

export default () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FadeInEffect style={{width: 270, height: 200}} />
    </View>
  );
};
