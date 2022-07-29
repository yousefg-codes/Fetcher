import React from 'react';
import {StyleSheet} from 'react-native';
import globalStyles from './globalStyles';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';
import fontStyles from './fontStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  loginButton: {
    ...globalStyles.commonButtons,
    width: scale(401.58),
    height: verticalScale(57.76),
    marginTop: 10,
  },
  logoContainer: {
    top: verticalScale(224),
    color: colors.grey,
    alignItems: 'center',
  },
  logoLoader: {
    position: 'absolute',
  },
  fetcherText: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(56),
  },
  driversText: {
    ...fontStyles.subTextFont,
    fontSize: moderateScale(48),
  },
  logo: {
    width: scale(205.6),
    height: verticalScale(137.2),
    resizeMode: 'contain',
  },
  btnsContainer: {
    position: 'absolute',
    bottom: verticalScale(8.96),
    left: scale(6.21),
  },
  buttonText: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(24),
    color: colors.white,
  },
  welcomeText: {
    fontWeight: 'bold',
    ...fontStyles.normalFont,
    fontSize: moderateScale(24),
    textAlign: 'center',
  },
  signUpButton: {
    ...globalStyles.commonButtons,
    width: scale(401.58),
    height: verticalScale(57.76),
  },
});
