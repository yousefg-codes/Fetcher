import {StyleSheet} from 'react-native'
import colors from './colors'
import globalStyles from './globalStyles'
import {scale, moderateScale, verticalScale} from './dimensions'
import fontStyles from './fontStyles'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    textInputContainer: {
        ...globalStyles.commonTextInputs,
        width: scale(248.4),
        flexDirection: 'row',
        paddingLeft: 0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    passwordContainer: {
        paddingLeft: scale(12.42), 
        paddingTop: verticalScale(17.92),
        paddingBottom: verticalScale(17.92),
        justifyContent: 'center'
    },
    atLeastText: {
        color: colors.darkishYellow,
        paddingTop: verticalScale(4.48),
        ...fontStyles.subTextFont,
        fontSize: moderateScale(14)
    },
    atLeastContainer: {
        paddingTop: verticalScale(8.96)
    },
    actualTextInput: {
        ...globalStyles.commonTextInputs,
        borderWidth: 0,
        width: '80%'
    }
})