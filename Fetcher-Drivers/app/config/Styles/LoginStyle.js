import React from 'react';
import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';
import globalStyles from './globalStyles';
import fontStyles from './fontStyles';

export default (styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loginText: {
    marginTop: verticalScale(4.48),
    ...fontStyles.normalFont,
    fontSize: moderateScale(28),
    color: colors.black,
  },
  signInButton: {
    ...globalStyles.commonButtons,
    marginTop: verticalScale(8.96),
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: verticalScale(45),
    width: scale(125),
  },
  textInputs: {
    ...globalStyles.commonTextInputs,
    marginTop: verticalScale(4.48),
    width: scale(295.7),
  },
  forgotPasswordText: {
    ...fontStyles.normalFont,
    color: colors.skyBlue,
    paddingTop: verticalScale(8.96),
    fontSize: moderateScale(16),
  },
  signInText: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(20),
    color: colors.white,
  },
}));
