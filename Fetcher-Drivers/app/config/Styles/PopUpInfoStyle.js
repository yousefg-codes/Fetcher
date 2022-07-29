import {StyleSheet} from 'react-native';
import colors from './colors';
import fontStyles from './fontStyles';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  modalStyle: {
    width: '95%',
    marginBottom: verticalScale(30),
  },
  topStyle: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 5,
    borderTopColor: colors.white,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  titleStyle: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(18),
  },
}));
