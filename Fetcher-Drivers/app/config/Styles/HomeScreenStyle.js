import React from 'react';
import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';
import fontStyles from './fontStyles';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bottomView: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: colors.white,
    bottom: 0,
  },
  drivingSessionBtn: {
    height: scale(62.1),
    width: scale(62.1),
    borderWidth: 1,
    borderRadius: scale(31.05),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: scale(16.56),
    top: verticalScale(8.96),
  },
  drivingSessionBtnText: {
    color: colors.white,
    ...fontStyles.normalFont,
    fontSize: moderateScale(24),
  },
  bottomViewHeaderContainer: {
    height: verticalScale(44.8),
    backgroundColor: colors.transparent,
    alignSelf: 'center',
    width: '97.5%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: colors.transparent,
  },
  arrowContainer: {
    width: scale(24),
    height: scale(24),
  },
  firstIconContainer: {
    width: '100%',
    marginTop: '25%',
    height: '50%',
    alignItems: 'flex-end',
  },
  secondIconContainer: {
    width: '100%',
    height: '50%',
    alignItems: 'flex-start',
  },
  miniTitles: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(14),
    marginLeft: scale(8.28),
    marginBottom: verticalScale(8.96),
  },
  graphContainer: {
    height: verticalScale(207),
    width: scale(372.6),
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: colors.white,
    borderColor: colors.white,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.7,
  },
}));
