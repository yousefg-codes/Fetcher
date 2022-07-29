import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import styles from '../../config/Styles/TermsOfServiceScreenStyle'
import Strings from '../../config/Strings/Strings'
import DrawerOpener from '../../components/GlobalComponents/DrawerOpener'

export default TermsOfServiceScreen = (props) => {
    return (
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <Text style={styles.header}>
                    Terms Of Service
                </Text>
                <Text style={styles.mainText}>
                    {Strings.termsOfService}
                </Text>
            </ScrollView>
            <DrawerOpener/>
        </View>
    )
}