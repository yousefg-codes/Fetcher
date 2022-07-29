import {StyleSheet} from 'react-native';
import colors from './colors';
import globalStyles from './globalStyles';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textInputs: {
    ...globalStyles.commonTextInputs,
    width: scale(289.8),
  },
  allInfoContainer: {
    paddingLeft: scale(12.42),
    height: verticalScale(328.8),
    marginBottom: verticalScale(20),
    justifyContent: 'space-evenly',
  },
}));
