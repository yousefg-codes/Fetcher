import {StyleSheet} from 'react-native'
import colors from './colors'
import fontStyles from './fontStyles'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    header: {
        ...fontStyles.normalFont,
        marginLeft: scale(20.7),
        marginTop: verticalScale(62.72),
        fontSize: moderateScale(22),
    },
    mainText: {
        ...fontStyles.subTextFont,
        marginLeft: scale(20.7),
        marginTop: verticalScale(8.96),
        fontSize: moderateScale(18)
    }
})