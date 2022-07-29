import React, {Component} from 'react'
import {View, Animated, Easing, StyleSheet} from 'react-native'
import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions'
import colors from '../../config/Styles/colors'

export default class LoadingDots extends Component {
    beginningSizes = [
        new Animated.Value(this.props.size*scale(1.035)), 
        new Animated.Value(0), 
        new Animated.Value(this.props.size*scale(1.035))
    ];
    componentDidMount(){
        for(var i = 0; i < this.beginningSizes.length; i++){
            if(i % 2 === 0){
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(this.beginningSizes[i], {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}),
                        Animated.timing(this.beginningSizes[i], {toValue: this.props.size*scale(1.035), duration: 500, easing: Easing.linear, useNativeDriver: false}),
                    ])
                ).start()
            }else{
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(this.beginningSizes[i], {toValue: this.props.size*scale(1.035), duration: 500, easing: Easing.linear, useNativeDriver: false}),
                        Animated.timing(this.beginningSizes[i], {toValue: 0, duration: 500, easing: Easing.linear, useNativeDriver: false}),
                    ])
                ).start()
            }
        }
    }
    render(){
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Animated.View style={[localStyles.dots, {height: this.beginningSizes[0], width: this.beginningSizes[0]}]}/>
                <Animated.View style={[localStyles.dots, {height: this.beginningSizes[1], width: this.beginningSizes[1], marginLeft: this.props.size*scale(0.52), marginRight: this.props.size*scale(0.52)}]}/>
                <Animated.View style={[localStyles.dots, {height: this.beginningSizes[2], width: this.beginningSizes[2]}]}/>
            </View>
        )
    }
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