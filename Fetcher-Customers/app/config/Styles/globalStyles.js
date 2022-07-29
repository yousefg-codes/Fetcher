import {StyleSheet} from 'react-native';
import {scale, moderateScale, verticalScale} from 'config/Styles/dimensions';
import colors from './colors';

const styles = StyleSheet.create({
  txtinput: {
    marginTop: 10,
    borderWidth: 2,
    color: colors.black,
    borderColor: colors.black,
    borderRadius: 10,
    paddingLeft: scale(8.28),
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Arial-BoldMT',
    fontWeight: 'bold',
    fontSize: moderateScale(18),
    width: scale(256.3),
    height: verticalScale(48.84),
  },
  view: {
    flex: 1,
  },
  labelsbig: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 25,
    marginTop: 40,
    marginLeft: 10,
  },
  labelssmall: {
    fontFamily: 'Arial-BoldMT',
    fontSize: 17,
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 20,
  },
  DrawerOpener: {
    borderRadius: 55 / 2,
    borderWidth: 1,
    borderColor: colors.transparent,
    shadowOffset: {width: 1, height: 1},
    shadowColor: colors.white,
    shadowOpacity: 1,
    backgroundColor: colors.transparent,
    width: 55,
    height: 55,
    alignContent: 'center',
    justifyContent: 'center',
  },
  next: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    padding: scale(15),
    paddingLeft: scale(25),
    paddingRight: scale(25),
    borderRadius: 20,
    borderWidth: 1,
    marginRight: scale(50),
    alignSelf: 'center',
  },
  next2: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    height: verticalScale(70),
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(85),
    marginLeft: scale(50),
    alignSelf: 'center',
  },
  nextxt: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT',
    fontSize: 20,
  },
});
export {styles};
