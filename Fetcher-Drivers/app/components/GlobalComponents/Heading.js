import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from '../../config/Styles/HeadingStyle';
import {Icon} from 'react-native-elements';
import colors from '../../config/Styles/colors';
import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions';

export default (Heading = props => {
  return (
    <View
      style={[
        styles.container,
        {justifyContent: props.onlyArrow ? 'flex-start' : 'center'},
        props.style,
      ]}>
      {props.onlyArrow ? (
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            if(props.onArrowPress !== undefined){  
              props.onArrowPress();
            }else{
              props.navigation.goBack(null); 
            }
          }}>
          <Icon
            color={colors.black}
            size={moderateScale(26)}
            type="antdesign"
            name="arrowleft"
          />
        </TouchableOpacity>
      ) : null}
      {props.children}
    </View>
  );
});
