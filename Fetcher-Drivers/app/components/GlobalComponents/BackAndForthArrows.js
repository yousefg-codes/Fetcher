import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import colors from '../../config/Styles/colors';
import styles from '../../config/Styles/BackAndForthArrowsStyle';
import {Icon} from 'react-native-elements';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';

const ContinueArrows = props => {
  const [isLoading, setIsLoading] = useState(false);

  const btnColor = bool => {
    if (!bool) {
      return colors.black;
    }
    return '#d3d3d3';
  };
  const buttonPressForward = async () => {
    props.onPress ? props.onPress() : null;
    if (props.onPressConditional) {
      setIsLoading(true);
      await props.onPressConditional(() => {
        setIsLoading(false);
      });
      setIsLoading(false);
    } else {
      props.navigation.navigate(props.nextScreen);
    }
  };
  const buttonPressBack = () => {
    props.onPressBack ? props.onPressBack() : null;
    props.navigation.goBack(null);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: scale(414),
      }}>
      <TouchableOpacity
        style={[
          styles.btnLeft,
          {
            borderColor: colors.black,
            backgroundColor: colors.black,
          },
        ]}
        onPress={() => buttonPressBack()}>
        <Icon size={30} name="arrow-back" color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btnRight,
          {
            borderColor: btnColor(props.notFilled),
            backgroundColor: btnColor(props.notFilled),
          },
          isLoading
            ? {
                padding: 15,
                paddingLeft: 30,
                paddingRight: 30,
              }
            : {},
        ]}
        disabled={props.notFilled}
        onPress={async () => await buttonPressForward()}>
        {isLoading ? (
          <ActivityIndicator animating={true} color={colors.white} />
        ) : (
          <Icon size={30} name="arrow-forward" color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ContinueArrows;
