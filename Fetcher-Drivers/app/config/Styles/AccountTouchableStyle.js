import React from 'react';
import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  container: {
    width: scale(403.65),
    borderWidth: 1,
    height: verticalScale(58.24),
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.black,
    backgroundColor: colors.black,
    marginBottom: 5,
  },
  nonOverrideView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(20),
    color: colors.white,
    marginLeft: 10,
  },
}));
