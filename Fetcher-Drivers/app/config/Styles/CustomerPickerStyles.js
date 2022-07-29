import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  listItemText: {
    fontFamily: 'Arial-BoldMT',
    color: colors.black,
    textAlign: 'center',
    fontSize: moderateScale(16),
  },
  displayedText: {
    fontFamily: 'Arial-BoldMT',
    color: colors.black,
  },
  modalStyle: {
    backgroundColor: colors.transparent,
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
  },
  scrollViewStyle: {
    width: scale(82.8),
    backgroundColor: colors.white,
    flex: 0,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 5,
    alignSelf: 'center',
    position: 'relative',
  },
  listTouchable: {
    flex: 1,
    width: scale(102.8),
    height: verticalScale(58.84),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAndListItemView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
