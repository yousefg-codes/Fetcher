import {StyleSheet} from 'react-native';
import colors from './colors';
import globalStyles from './globalStyles';
import {scale, moderateScale, verticalScale} from './dimensions';

export default (styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainerForScrollView: {
    alignItems: 'center',
  },
  totalCostText: {
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
    color: colors.white,
  },
  totalCostContainer: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    padding: 10,
    borderWidth: 1,
    backgroundColor: colors.black,
    borderColor: colors.black,
    borderRadius: 10,
  },
  finishOrderBtn: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 2,
    paddingBottom: 2,
    marginLeft: 10,
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  customerName: {
    color: colors.black,
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(18),
    marginLeft: scale(10.35),
    marginTop: 10,
    width: '90%',
    marginBottom: 5,
    borderBottomWidth: 4,
    borderBottomColor: colors.black,
    alignSelf: 'flex-start',
  },
  finishOrderText: {
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(20),
  },
  quantityText: {
    textAlign: 'center',
    backgroundColor: '#fff',
    fontFamily: 'Arial-BoldMT',
    fontSize: moderateScale(15),
    alignSelf: 'center',
    paddingBottom: 5,
  },
}));
