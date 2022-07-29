import {StyleSheet} from 'react-native'
import colors from './colors'
import globalStyles from './globalStyles'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    textInput: {
        ...globalStyles.commonTextInputs,
        width: scale(248.4)
    },
    emailContainer: {
        paddingLeft: scale(12.42), 
        height: verticalScale(89.6),
        justifyContent: 'center'
    }
})