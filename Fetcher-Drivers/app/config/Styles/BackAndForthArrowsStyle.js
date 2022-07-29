import {StyleSheet} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'

export default styles = StyleSheet.create({
    btnLeft: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 20,
        borderWidth: 1,
        marginLeft: scale(20.7),
        alignSelf: 'center',
    },
    btnRight: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: scale(20.7),
        alignSelf: 'center',
    }
})