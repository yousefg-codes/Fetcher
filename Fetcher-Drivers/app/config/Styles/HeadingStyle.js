import React from 'react';
import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';
import globalStyles from './globalStyles';

export default (styles = StyleSheet.create({
  container: {
    width: scale(414),
    height: verticalScale(54.8),
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: scale(20.7),
    paddingRight: scale(20.7),
    marginLeft: scale(12.42),
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
}));
