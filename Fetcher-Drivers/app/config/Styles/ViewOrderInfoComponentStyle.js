import React from 'react';
import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';
import fontStyles from './fontStyles';

export default (styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    width: scale(160.76),
    // width: scale(165.6),
    // height: verticalScale(53.76),
    backgroundColor: '#0000',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    bottom: verticalScale(582.4),
    alignSelf: 'center',
  },
  clickToViewOrderBtn: {
    width: scale(128.98),
    height: verticalScale(116.48),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange,
    borderWidth: 1,
    borderRadius: 10,
    paddingBottom: 2,
    paddingTop: 2,
    borderColor: colors.orange,
  },
  clickToViewOrderText: {
    color: colors.darkGrey,
    textAlign: 'center',
    marginRight: scale(8.28),
    ...fontStyles.normalFont,
    alignSelf: 'center',
    width: scale(103.5),
    fontSize: moderateScale(18),
  },
}));
