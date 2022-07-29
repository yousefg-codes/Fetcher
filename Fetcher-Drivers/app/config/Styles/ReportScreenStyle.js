import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'
import {StyleSheet} from 'react-native'

export default styles = StyleSheet.create({
    reportInput: {
      height: verticalScale(298.67),
      width: scale(276),
      borderWidth: 4,
      borderRadius: 5,
      textAlignVertical: 'top',
      borderColor: colors.black,
    },
    describeIssueTxt: {
      color: colors.black,
      fontFamily: 'Arial-BoldMT', fontSize: moderateScale(16),
    },
  });