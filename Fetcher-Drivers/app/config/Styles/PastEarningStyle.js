import {StyleSheet} from 'react-native'
import colors from './colors'
import fontStyles from './fontStyles'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    touchable: {
        width: scale(393.3),
        height: verticalScale(44.8),
        borderWidth: 1,
        backgroundColor: colors.white,
        borderColor: colors.white,
        shadowColor: colors.black,
        shadowOffset: {width: 3, height: 3},
        shadowOpacity: 0.7,
        elevation: 2,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(17.92)
    },
    date: {
        ...fontStyles.normalFont,
        fontSize: moderateScale(18),
        paddingLeft: scale(12.42)
    },
    amount: {
        ...fontStyles.normalFont,
        fontSize: moderateScale(16),
        color: colors.green,
        paddingLeft: scale(12.42)
    }
})