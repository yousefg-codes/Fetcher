import React, {Component, useEffect, useState} from 'react'
import {View, Animated, Easing, StyleSheet} from 'react-native'
import {scale, moderateScale, verticalScale} from '../../config/Styles/dimensions'
import colors from '../../config/Styles/colors'

export default LoadingDots = (props) => {
    const [beginningSizes, setBeginningSizes] = useState([
        new Animated.Value(props.size*scale(1.035)), 
        new Animated.Value(0), 
        new Animated.Value(props.size*scale(1.035))
    ]);
    useEffect(() => {
        for(var i = 0; i < beginningSizes.length; i++){
            if(i % 2 === 0){
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(beginningSizes[i], {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}),
                        Animated.timing(beginningSizes[i], {toValue: props.size*scale(1.035), duration: 500, easing: Easing.linear, useNativeDriver: false}),
                    ])
                ).start()
            }else{
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(beginningSizes[i], {toValue: props.size*scale(1.035), duration: 500, easing: Easing.linear, useNativeDriver: false}),
                        Animated.timing(beginningSizes[i], {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}),
                    ])
                ).start()
            }
        }
    }, [])
    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Animated.View style={[localStyles.dots, {height: beginningSizes[0], width: beginningSizes[0]}]}/>
            <Animated.View style={[localStyles.dots, {height: beginningSizes[1], width: beginningSizes[1], marginLeft: props.size*scale(0.5175), marginRight: props.size*scale(0.5175)}]}/>
            <Animated.View style={[localStyles.dots, {height: beginningSizes[2], width: beginningSizes[2]}]}/>
        </View>
    )
}
const localStyles = StyleSheet.create({
    dots: {
        borderWidth: 1,
        borderRadius: scale(10.35),
        backgroundColor: colors.orange,
        borderColor: colors.orange,
        opacity: 0.7,
    }
})