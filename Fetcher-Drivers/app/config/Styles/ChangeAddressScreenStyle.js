import {StyleSheet} from 'react-native'
import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    accountSettings: {
        width: scale(403.65),
        borderWidth: 1,
        height: verticalScale(58.24),
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: colors.black,
        alignSelf: 'center',
        backgroundColor: colors.black,
        marginBottom: 5,
        borderLeftColor: colors.lightBlue,
        borderRightColor: colors.black,
        borderTopColor: colors.grey,
        borderBottomColor: colors.grey,
        backgroundColor: colors.black,
        height: verticalScale(74.66),
        overflow: 'hidden',
        width: scale(403.65),
      },
      accountSettingsText: {
        color: colors.white,
        fontSize: moderateScale(20),
        marginTop: 10,
        width: '70%',
        ...fontStyles.normalFont,
        fontSize: moderateScale(15),
        marginLeft: scale(21.12),
      },
      animatedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      editContainer: {
        width: scale(41.4), 
        height: scale(41.4),
        borderWidth: 1,
        borderColor: colors.white,
        backgroundColor: colors.white,
        alignItems: 'center',
        marginRight: scale(41.4),
        justifyContent: 'center',
        borderRadius: scale(20.7),
      },
      starView: {
        width: scale(51.75),
        height: verticalScale(81.45),
        alignItems: 'center',
        backgroundColor: colors.lightBlue,
        justifyContent: 'center',
      },
      addressComponentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: verticalScale(99.56),
      },
})