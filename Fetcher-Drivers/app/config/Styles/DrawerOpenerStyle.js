import {StyleSheet} from 'react-native'
import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'

export default styles = StyleSheet.create({
    touchableOpacity: {
        width: scale(41.4),
        height: scale(41.4),
        borderWidth: 1,
        borderColor: colors.white,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: scale(16.56),
        top: verticalScale(8.96),
        borderRadius: scale(20.7),
        elevation: 4,
        shadowColor: colors.black,
        shadowOpacity: 0.7,
        shadowOffset: {width: 5, height: 5}
    }
})