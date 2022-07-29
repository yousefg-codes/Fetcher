import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Images from '../../config/Images/Images';
import colors from '../../config/Styles/colors';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import LoadingDots from './LoadingDots';
import styles from '../../config/Styles/ProductItemStyle';

const ProductItem = props => {
  const [stars, setStars] = useState([]);
  const [imageIsLoading, setImageIsLoading] = useState(true);

  useEffect(() => {
    setStars(determineNumStars(props.rating, styles.starStyle));
  }, []);

  const ImageIsHorizontal = {
    marginBottom: props.isHorizontal ? verticalScale(13.78) : 0,
    width: props.isHorizontal ? scale(393.3) : scale(138),
    flexDirection: props.isHorizontal ? 'row' : 'column',
  };

  return (
    <View style={[styles.itemButton, ImageIsHorizontal, props.style]}>
      <Image
        source={props.imagePath}
        resizeMode="cover"
        onLoadEnd={() => {
          setImageIsLoading(false);
        }}
        style={[
          styles.imageStyle,
          {
            height: props.isHorizontal ? '100%' : verticalScale(112),
            width: props.isHorizontal ? verticalScale(128) : scale(138),
          },
        ]}
      />
      {imageIsLoading ? (
        <View
          style={[
            styles.imageStyle,
            styles.imageLoader,
            {backgroundColor: colors.white, borderColor: colors.white},
            {
              height: props.isHorizontal ? '100%' : verticalScale(112),
              width: props.isHorizontal ? verticalScale(128) : scale(138),
            },
          ]}>
          <LoadingDots size={12} />
        </View>
      ) : null}
      <View
        style={{
          paddingLeft: props.isHorizontal ? scale(5.91) : 0,
        }}>
        <Text
          style={{
            fontFamily: 'Arial-BoldMT',
            fontSize: props.isHorizontal ? 20 : 15,
          }}>
          {props.name}
        </Text>
        <View
          style={{
            width: props.isHorizontal ? '75%' : '95%',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {/* <Text
              style={{
                fontFamily: 'Arial-BoldMT', fontSize: props.isHorizontal ? 16 : 12,
                color: '#808080',
              }}>
              {props.description}
            </Text> */}
          <Text
            style={{
              fontFamily: 'Arial-BoldMT',
              fontSize: props.isHorizontal ? 16 : 12,
              color: '#808080',
            }}>
            ${props.cost}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Arial-BoldMT',
            fontSize: props.isHorizontal ? 16 : 12,
            color: '#808080',
            width: '80%',
          }}>
          {props.businessName}
        </Text>
        <View style={{flexDirection: 'row'}}>
          {stars}
          <Text
            style={[
              styles.ratingText,
              {
                fontSize: props.isHorizontal ? 20 : 14,
                marginLeft: props.isHorizontal ? scale(13.8) : scale(11.82),
              },
            ]}>
            {props.rating.toFixed(1)}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {props.categories.map((element, index) => (
            <View
              style={[
                styles.categories,
                {
                  paddingVertical: verticalScale(4.48),
                  paddingHorizontal: scale(6.21),
                },
              ]}>
              <Text style={{color: colors.white, fontFamily: 'Arial-BoldMT'}}>
                {props.categories}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
// class ProductInfo extends Component {
//   state = {
//     businessLocations: {},
//     isLoading: true,
//     stars: [],
//     ...props.navigation.params,
//   };
//   async componentDidMount() {
//     let data = await FirebaseMethods.getAllBusinessLocsWhere(
//       'businessName',
//       '==',
//       '"' + Location + '"',
//     );
//     setState({
//       stars: determineNumStars(rating, styles.starStyle),
//     });
//     setState({businessLocations: data, isLoading: false});
//   }
//   render() {
//     if (isLoading) {
//       return <SplashScreen />;
//     }
//     return (
//       <View style={{backgroundColor: colors.white, flex: 1}}>
//         <Heading
//           defaultRow
//           onPress={() => props.navigation.goBack(null)}
//           navigation={props.navigation}
//           style={{
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             alignContent: 'center',
//           }}
//         />
//         <ScrollView>
//           <Image
//             source={imagePath}
//             resizeMode="contain"
//             style={{
//               height: verticalScale(13.78)4,
//               width: dimensions.width,
//             }}
//           />
//           <View>
//             <View
//               style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//               <View style={styles.infoWrapper}>
//                 <Text style={styles.text}>
//                   name: {name}
//                 </Text>
//               </View>
//               <View style={styles.infoWrapper}>
//                 <Text
//                   style={[
//                     styles.text,
//                     {marginRight: scale(13.8)},
//                   ]}>
//                   Cost: <Text style={{color: '#00ff00'}}>$</Text>
//                   {Cost}
//                 </Text>
//               </View>
//             </View>
//             {/* <View style={styles.infoWrapper}>
//               <Text style={styles.text}>
//                 Business Location: {Location}
//               </Text>
//             </View> */}
//             {
//               //I am debating whether I should give every item a map, since that is highly ineffective,
//               //when it comes to costs.
//             }
//             {/* {businessLocations.docs.length === 0 ?
//                 <Text style={[styles.text, {color: colors.yellow, alignSelf: 'center', textAlign: 'center'}]}>We can't display the location since this product is too far from your current main address</Text>
//               : <Maps
//                 style={{ position: 'relative' }}
//                 zoomOnBusinessGiven
//                 navigation={props.navigation}
//                 businessLocations={businessLocations}
//               />
//             } */}
//             <View style={styles.infoWrapper}>
//               <Text style={styles.text}>
//                 Falls Under the following category:
//               </Text>
//               <View style={{marginLeft: scale(13.8)}}>
//                 {category.split(' ').map(string => (
//                   <Text style={[styles.text, {marginTop: 0}]}>
//                     {string}
//                   </Text>
//                 ))}
//               </View>
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 alignSelf: 'center',
//               }}>
//               {stars}
//               <Text
//                 style={[
//                   styles.text,
//                   {color: '#808080', fontFamily: 'Arial-BoldMT', fontSize: dimensions.fontScale * 30, marginLeft: 10},
//                 ]}>
//                 {rating}
//               </Text>
//             </View>
//           </View>
//           {addable ? (
//             <TouchableOpacity
//               style={[
//                 styles.next,
//                 {
//                   marginRight: 0,
//                   backgroundColor: colors.orange,
//                   borderColor: colors.orange,
//                 },
//               ]}
//               onPress={async () => {
//                 await addToCart(itemId);
//                 props.navigation.goBack(null);
//               }}>
//               <Text style={{color: '#fff'}}>Add to Cart</Text>
//             </TouchableOpacity>
//           ) : null}
//         </ScrollView>
//       </View>
//     );
//   }
//   cartIncludes(cart, itemId) {
//     for (var i = 0; i < cart.length; i++) {
//       if (cart[i].itemId === itemId) {
//         return i;
//       }
//     }
//     return -1;
//   }
//   async addToCart(itemId) {
//     let items = (await FirebaseMethods.getCurrentUserData('cart')).items;
//     let indexInCart = cartIncludes(items, itemId);
//     if (indexInCart !== -1) {
//       items[indexInCart].quantity += 1;
//     } else {
//       items.push({itemId, quantity: 1});
//     }
//     await FirebaseMethods.editCart(items);
//     if (GlobalHandler.screens[2] !== undefined) {
//       await GlobalHandler.screens[2].componentDidMount();
//     }
//     showMessage({
//       message: 'Item Added',
//       type: 'success',
//       description: 'this item has been added to your cart',
//       position: 'top',
//       duration: 3000,
//     });
//   }
// }
// const styles = StyleSheet.create({
//   text: {
//     fontFamily: 'Arial-BoldMT', fontSize: moderateScale(20),
//     //marginTop: dimensions.height/50,
//     color: colors.white,
//     //marginLeft: dimensions.width/30
//   },
//   infoWrapper: {
//     ...styles.next,
//     marginRight: 0,
//     padding: 9,
//     backgroundColor: colors.black,
//   },
//   starStyle: {
//     height: scale(10),
//     width: scale(10),
//   },
// });
const determineNumStars = (rating, style) => {
  let arr = [];
  let lastIndex = -1;
  for (var i = 0; i < parseInt(rating); i++) {
    arr[i] = <Image key={i} style={style} source={Images.filledYellowStar} />;
    //console.log(i);
    lastIndex = i;
  }
  if (parseFloat(rating) % 1.0 >= 0.4 && parseFloat(rating) % 1.0 <= 0.6) {
    arr[lastIndex + 1] = (
      <Image key={i} style={style} source={Images.halfFilledYellowStar} />
    );
    lastIndex++;
  }
  for (var i = lastIndex + 1; i < 5; i++) {
    arr[i] = <Image style={style} key={i} source={Images.unFilledYellowStar} />;
  }
  return arr;
};

export {ProductItem};
