import {StyleSheet} from 'react-native'
import fontStyles from './fontStyles'
import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'

export default styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white,
      },
      loginText: {
        marginTop: verticalScale(4.48),
        ...fontStyles.normalFont,
        textAlign: 'center',
        fontSize: moderateScale(16),
        color: colors.black,
      },
      textInputs: {
        ...globalStyles.commonTextInputs,
        marginTop: verticalScale(4.48),
        width: scale(295.7),
      }
})