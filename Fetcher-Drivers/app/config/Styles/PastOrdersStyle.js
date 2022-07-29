import {StyleSheet} from 'react-native'
import {scale, moderateScale, verticalScale} from './dimensions'
import colors from './colors'
import fontStyles from './fontStyles'
import globalStyles from './globalStyles'

export default styles = StyleSheet.create({
    itemsViewStyle: {
      paddingLeft: scale(15.86),
      marginTop: verticalScale(34.33),
    },
    basicInfoView: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: verticalScale(18.25),
    },
    detailsHeadingText: {
      color: '#ff0000',
      alignSelf: 'center',
      ...fontStyles.normalFont,
      fontSize: moderateScale(20),
      marginRight: verticalScale(24.31),
    },
    quantityText: {
      textAlign: 'center',
      backgroundColor: colors.white,
      ...fontStyles.normalFont,
      fontSize: moderateScale(16),
      alignSelf: 'center',
      marginBottom: 5,
    },
    pastOrderObjView: {
      alignSelf: 'center',
      backgroundColor: colors.black,
      borderRadius: 15,
      padding: scale(4),
      width: scale(403.65),
      height: verticalScale(208.37),
      shadowOpacity: 0.5,
      marginTop: verticalScale(12.16),
      shadowOffset: {height: 3, width: 3},
      shadowRadius: 1,
      shadowColor: colors.black,
      elevation: scale(1.8),
      backgroundColor: colors.black,
    },
    headingText: {
      width: scale(153.3),
      paddingTop: verticalScale(12.16),
      color: colors.white,
      paddingBottom: verticalScale(12.16),
      paddingLeft: scale(5.28),
      paddingRight: scale(5.28),
      alignSelf: 'center',
      ...fontStyles.normalFont,
      fontSize: moderateScale(25),
    },
    numOrdersTxt: {
      marginLeft: scale(10.56),
      ...fontStyles.normalFont,
      fontSize: moderateScale(20),
      marginTop: verticalScale(12.16),
      marginBottom: verticalScale(12.16),
    },
    headingStyle: {
      paddingTop: verticalScale(12.16),
      paddingBottom: verticalScale(12.16),
    },
    detailsText: {
        ...fontStyles.normalFont,
        fontSize: moderateScale(18),
      color: colors.white,
    },
    infoWrapper: {
      ...globalStyles.commonButtons,
      marginRight: 0,
      padding: 5,
      paddingRight: 5,
      paddingLeft: 5,
      backgroundColor: colors.black,
    },
  });