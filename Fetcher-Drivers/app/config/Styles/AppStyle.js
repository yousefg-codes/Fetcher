import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from './dimensions';
import colors from './colors';

export default (styles = StyleSheet.create({
  askToDriveModal: {
    width: scale(138),
    height: verticalScale(99.56),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.white,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
