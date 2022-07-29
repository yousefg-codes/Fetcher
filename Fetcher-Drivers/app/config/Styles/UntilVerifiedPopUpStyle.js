import {StyleSheet} from 'react-native'
import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'
import fontStyles from './fontStyles'

export default styles = StyleSheet.create({
    modalStyle: {
        flex: 0,
        top: (verticalScale(448))-(verticalScale(112)),
        left: scale(20.7),
        width: scale(331.2),
        height: verticalScale(224),
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: colors.white,
        borderColor: colors.white,
        justifyContent: 'space-evenly',
        borderRadius: 5
    },
    untilVerifiedText: {
        color: colors.black,
        width: '90%',
        textAlign: 'center',
        ...fontStyles.normalFont,
        fontSize: moderateScale(16)
    },
    okText: {
        color: colors.white,
        ...fontStyles.subTextFont,
        fontSize: moderateScale(16)
    },
    touchableOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkishGreen,
        width: '80%',
        height: '15%',
        borderWidth: 1,
        borderColor: colors.darkishGreen,
        borderRadius: 5
    }
})