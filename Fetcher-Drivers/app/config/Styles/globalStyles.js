import React from 'react';
import {StyleSheet} from 'react-native';
import colors from './colors';
import fontStyles from './fontStyles';
import {scale, moderateScale, verticalScale} from './dimensions';

export default StyleSheet.create({
  commonButtons: {
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderWidth: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.black,
    backgroundColor: colors.black,
  },
  indentedSignUpContainer: {
    paddingLeft: scale(20.7),
  },
  signUpHorizontalContainer: {
    width: scale(414),
    paddingTop: verticalScale(8.96),
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpVerticalContainer: {
    height: verticalScale(134.4),
    paddingTop: verticalScale(17.92),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: scale(207),
  },
  signUpHeader: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(24),
    color: colors.black,
    paddingTop: verticalScale(22.4),
    paddingLeft: scale(12.42),
  },
  signUpText: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(18),
    color: colors.black,
  },
  commonTextInputs: {
    borderWidth: 2,
    color: colors.black,
    borderColor: colors.black,
    borderRadius: 10,
    marginTop: verticalScale(10),
    paddingLeft: scale(8.28),
    ...fontStyles.normalFont,
    fontSize: moderateScale(18),
    width: scale(186.3),
    height: verticalScale(48.84),
  },
});
