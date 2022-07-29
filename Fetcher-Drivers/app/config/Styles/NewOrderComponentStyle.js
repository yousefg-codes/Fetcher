import React from 'react';
import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';
import globalStyles from './globalStyles';

export default (styles = StyleSheet.create({
  animatedContainer: {
    flex: 0,
    top: '40%',
    //left: '1.5%',
    alignSelf: 'center',
    height: verticalScale(199.2),
    width: scale(383.3),
    padding: scale(5),
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  infoContainer: {
    flex: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 10,
  },
  acceptBtn: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.green,
    marginRight: 10,
    backgroundColor: colors.green,
  },
  rejectBtn: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 7,
    marginLeft: 10,
    borderColor: colors.red,
    backgroundColor: colors.red,
  },
  acceptAndRejectText: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(14),
  },
  infoText: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(14),
    color: colors.black,
    textAlign: 'center',
  },
  infoSubContainers: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}));
