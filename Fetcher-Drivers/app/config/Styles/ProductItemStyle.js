import {StyleSheet} from 'react-native'
import colors from './colors'
import {scale, moderateScale, verticalScale} from './dimensions'
import globalStyles from './globalStyles';
import fontStyles from './fontStyles';

export default styles = StyleSheet.create({
  itemButton: {
    backgroundColor: colors.white,
    alignSelf: 'center',
    elevation: 2,
    marginTop: 2,
    shadowOpacity: 0.5,
    shadowColor: colors.black,
    shadowOffset: {height: 3, width: 3},
    borderWidth: 5,
    borderRadius: 5,
    borderColor: colors.white
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  quantityAndRemoveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: verticalScale(44.8),
    width: scale(247.05)
  },
  quantityText: {
    textAlign: 'center',
    backgroundColor: colors.white,
    fontFamily: 'Arial-BoldMT', 
    fontSize: moderateScale(15),
    paddingBottom: verticalScale(6.08),
    marginRight: scale(10.56),
  },
  starStyle: {
    height: scale(20.7),
    width: scale(20.7),
  },
  imageLoader: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontFamily: 'Arial-BoldMT', 
    color: '#808080',
  },
  imageStyle: {
    paddingLeft: 5,
    alignSelf: 'center',
    borderLeftWidth: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  removeBtnStyle: {
    ...styles.next,
    marginRight: 3,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'flex-end',
    paddingTop: verticalScale(4.48),
    paddingBottom: verticalScale(4.48),
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  removeBtnTxtStyle: {
    color: colors.white,
    fontFamily: 'Arial-BoldMT', 
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  text: {
    backgroundColor: colors.black,
    color: colors.white,
    fontFamily: 'Arial-BoldMT', 
    fontSize: moderateScale(15),
  },
  marker: {
    backgroundColor: colors.black,
    borderWidth: 2,
    borderRadius: 2,
  },
});