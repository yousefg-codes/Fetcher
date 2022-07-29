import {StyleSheet} from 'react-native'
import colors from './colors'
import globalStyles from './globalStyles'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    verticalContainer: {
        width: '100%',
        height: verticalScale(179.2),
        justifyContent: 'space-evenly',
        paddingLeft: scale(12.42)
    },
    textInputs: {
        ...globalStyles.commonTextInputs,
        width: scale(248.4)
    }
})