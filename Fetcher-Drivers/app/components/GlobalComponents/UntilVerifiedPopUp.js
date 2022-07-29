import React, { Component } from 'react'
import Modal from 'react-native-modal'
import styles from '../../config/Styles/UntilVerifiedPopUpStyle'
import { TouchableOpacity, Text } from 'react-native'
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler'

export class UntilVerifiedPopUp extends Component{
    state = { 
        isVisible: false,
        text: ''
    }
    showUntilVerified(text) { 
        this.setState({isVisible: true, text: text})
    }
    render(){
        return (
            <Modal style={styles.modalStyle} isVisible={this.state.isVisible}>
                <Text style={styles.untilVerifiedText}>
                    {this.state.text === '' ? 'You will not be able to drive for us ("Fetcher") until we have verified your identity. Should we discover that you have given us a false identity, we will notify you via email.'
                     : this.state.text}</Text>
                <TouchableOpacity style={styles.touchableOpacity} onPress={() => {
                    this.setState({isVisible: false})
                }}>
                    <Text style={styles.okText}>Ok</Text>
                </TouchableOpacity>
            </Modal>
        )
    }
}
export const showUntilVerified = (text) => {
    GlobalStateHandler.untilVerifiedRef.showUntilVerified(text);
}  