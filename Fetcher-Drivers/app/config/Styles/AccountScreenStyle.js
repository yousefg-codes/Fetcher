import React from 'react';
import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  logOutText: {
    color: colors.red,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(18),
  },
  drivingSessionBtn: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  drivingSessionBtnText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  cantLogoutText: {
    textAlign: 'center',
    color: colors.red,
    fontWeight: 'bold',
    fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16)
  },
  imageNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: scale(414),
    paddingBottom: verticalScale(62.72),
    paddingTop: verticalScale(89.6),
    alignSelf: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'cover',
    width: scale(103.5),
    height: scale(103.5),
    borderWidth: 1,
    marginRight: scale(20.7),
    marginLeft: scale(41.4),
    borderColor: colors.transparent,
    borderRadius: scale(51.75)
  },
  nameStyle: {
    ...fontStyles.normalFont,
    marginRight: scale(41.4),
    fontSize: moderateScale(22),
    color: colors.black
  }
}));
