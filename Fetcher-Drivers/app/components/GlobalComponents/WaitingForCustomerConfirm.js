import React from 'react'
import Modal from 'react-native-modal'
import styles from '../../config/Styles/WaitingForCustomerConfirmStyle'
import { Text, ActivityIndicator } from 'react-native'
import colors from '../../config/Styles/colors'

export default WaitingForCustomerConfirm = (props) => {
    return (
        <Modal isVisible={true} style={styles.modalStyle}>
            <Text style={styles.waitingText}>
                Waiting for customer to confirm
            </Text>
            <ActivityIndicator animating={true} color={colors.orange} size="large" />
        </Modal>
    )
}