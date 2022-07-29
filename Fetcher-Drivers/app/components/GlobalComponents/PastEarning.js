import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions'
import colors from '../../config/Styles/colors'
import styles from '../../config/Styles/PastEarningStyle'

export default PastEarning  = (props) => {
    return (
        <TouchableOpacity onPress={() => props.onPress()} style={styles.touchable}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.date}>
                    {props.fullDate}
                </Text>
                <Text style={styles.amount}>
                    ${props.amount}
                </Text>
            </View>
            <Icon
                type="ionicon"
                style={{marginRight: 10}}
                name="ios-arrow-forward"
                size={moderateScale(24)}
                color={colors.black}
            />        
        </TouchableOpacity>
    )
}