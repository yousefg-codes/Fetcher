import {StyleSheet} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    modalStyle: {
        flex: 0,
        width: '75%',
        height: '17%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.white,
        borderColor: colors.white,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    waitingText: {
        color: colors.black,
        fontWeight: 'bold',
        fontFamily: 'Arial-BoldMT', fontSize: moderateScale(18)
    }
})