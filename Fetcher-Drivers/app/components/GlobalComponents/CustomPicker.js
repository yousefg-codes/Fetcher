import React, {Component, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../config/Styles/dimensions';
import colors from '../../config/Styles/colors';
import Modal from 'react-native-modal';
import GlobalStateHandler from '../../config/GlobalHandler/GlobalStateHandler';
import styles from '../../config/Styles/CustomerPickerStyles';

const displayCustomPicker = (list, onChangeSelection) => {
  GlobalStateHandler.customPickerRef.displaySelf(list, (item, index) =>
    onChangeSelection(item, index),
  );
};

export const CustomPickerIcon = props => {
  const [chosenIndex, setChosenIndex] = useState(props.defaultIndex);
  return (
    <View style={styles.buttonAndListItemView}>
      <Text
        style={[
          styles.displayedText,
          props.textStyle,
          {fontSize: moderateScale(16)},
        ]}>
        {props.extraPrecedingText === undefined ? '' : props.extraPrecedingText}
        {props.list[chosenIndex]}
      </Text>
      <TouchableOpacity
        style={{marginLeft: 7}}
        onPress={() =>
          displayCustomPicker(props.list, (item, index) => {
            setChosenIndex(index);
            props.onChangeSelection(item);
          })
        }>
        <Icon
          name="arrow-down-drop-circle-outline"
          color={colors.black}
          type="material-community"
          size={scale(23.5)}
        />
      </TouchableOpacity>
    </View>
  );
};

export class CustomPicker extends Component {
  state = {
    listIsOpen: false,
    list: [],
    onChangeSelection: null,
  };
  displaySelf(list, onChangeSelection) {
    this.setState({list, onChangeSelection, listIsOpen: true});
  }
  render() {
    return (
      <Modal
        onBackdropPress={() => {
          this.setState({listIsOpen: false});
        }}
        isVisible={this.state.listIsOpen}
        style={[
          styles.modalStyle,
          this.state.list.length > 5
            ? {
                top: 50 - 40 / 2 + '%',
              }
            : {
                top: 50 - (this.state.list.length * 8) / 2 + '%',
              },
        ]}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
          style={[
            styles.scrollViewStyle,
            this.state.list.length > 5
              ? {
                  height: verticalScale(358.4),
                }
              : {
                  height: this.state.list.length * verticalScale(71.68),
                },
          ]}>
          {this.state.list.map((element, index) => (
            <TouchableOpacity
              key={index}
              style={styles.listTouchable}
              onPress={() => {
                this.state.onChangeSelection(this.state.list[index], index);
                this.setState({listIsOpen: false});
              }}>
              <Text style={[styles.listItemText]}>{element}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>
    );
  }
}
