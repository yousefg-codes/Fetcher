import {StyleSheet} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'
import fontStyles from './fontStyles'
import globalStyles from './globalStyles'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    ssnAndDriverNumContainer: {
        justifyContent: 'space-evenly',
        paddingLeft: scale(20.7),
        height: verticalScale(134.4)
    },
    noticeText: {
        ...fontStyles.normalFont,
        color: colors.red,
        paddingTop: verticalScale(17.92),
        fontSize: moderateScale(16),
        paddingLeft: scale(20.7),
    },
    textInputs: {
        ...globalStyles.commonTextInputs,
        width: scale(248.4)
    },
    checkBoxContainer: {
        paddingTop: verticalScale(17.92),
        paddingLeft: scale(20.7),
        paddingBottom: verticalScale(17.92),
        flexDirection: 'row'
    },
    policiesText: {
        ...fontStyles.normalFont,
        fontSize: moderateScale(14),
        color: colors.black,
        paddingLeft: scale(12.42),
        width: '90%'
    },
    policiesImportantText: {
        color: colors.skyBlue
    }
})