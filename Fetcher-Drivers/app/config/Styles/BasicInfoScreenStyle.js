import {StyleSheet, StatusBar} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    nameContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderWidth: 2,
        flex: 0,
        borderColor: colors.black,
        borderRadius: 10,
        paddingTop: verticalScale(4.48),
        paddingBottom: verticalScale(4.48),
        paddingLeft: scale(4.14),
        paddingRight: scale(4.14)
    }
})