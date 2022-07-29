import {StyleSheet} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1,
        backgroundColor: colors.white
    },
    loadingPastOrder: {
        alignSelf: 'center',
        backgroundColor: colors.darkGrey,
        borderRadius: 15,
        padding: scale(4),
        width: scale(403.65),
        height: verticalScale(208.37),
        marginTop: verticalScale(12.16),
        backgroundColor: colors.darkGrey,
    }
})