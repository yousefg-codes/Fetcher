import React from 'react';
import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';
import globalStyles from './globalStyles';

export default (styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    left: scale(124.2),
    alignSelf: 'center',
    height: verticalScale(76.16),
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: colors.black,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(165.6),
    backgroundColor: colors.white,
  },
  waitingText: {
    fontFamily: 'Arial-BoldMT', 
    textAlign: 'center',
    fontSize: moderateScale(14),
    marginBottom: 8,
  },
}));
