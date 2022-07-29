import {StyleSheet} from 'react-native';
import colors from './colors';
import {scale, moderateScale, verticalScale} from './dimensions';
import fontStyles from './fontStyles';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  accountScreen: {
    width: '100%',
    height: verticalScale(179.2),
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '87.5%',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: scale(82.8),
    height: scale(82.8),
    borderWidth: 1,
    borderColor: colors.transparent,
    borderRadius: scale(41.4),
  },
  nameStyle: {
    ...fontStyles.normalFont,
    fontSize: moderateScale(20),
    color: colors.white,
  },
  ratingText: {
    ...fontStyles.subTextFont,
    fontSize: moderateScale(16),
    color: colors.white,
  },
  policyScreensText: {
    textDecorationLine: 'underline',
    fontSize: moderateScale(16),
    ...fontStyles.subTextFont,
    color: colors.lightBrown,
    marginLeft: scale(20.7),
  },
}));
