import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {scale, verticalScale, moderateScale} from 'config/Styles/dimensions';
import colors from '../../config/Styles/colors';
import Modal from 'react-native-modal';
import GlobalHandler from '../../config/GlobalHandler/GlobalHandler';

const displayCustomPicker = (list, onChangeSelection) => {
  GlobalHandler.customPickerRef.displaySelf(list, (item, index) =>
    onChangeSelection(item, index),
  );
};

export class CustomPickerIcon extends Component {
  render() {
    return (
      <View style={localStyles.buttonAndListItemView}>
        <Text style={[localStyles.displayedText, this.props.textStyle]}>
          {this.props.extraPrecedingText === undefined
            ? ''
            : this.props.extraPrecedingText}
          {this.props.list[this.props.defaultIndex]}
        </Text>
        <TouchableOpacity
          style={{marginLeft: 7}}
          onPress={() =>
            displayCustomPicker(this.props.list, (item, index) => {
              this.props.onChangeSelection(item);
            })
          }>
          <Icon
            name="arrow-down-drop-circle-outline"
            color={colors.black}
            type="material-community"
            size={scale(18)}
          />
          {/* {//SCCCALLELED} */}
        </TouchableOpacity>
      </View>
    );
  }
}

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
          localStyles.modalStyle,
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
            localStyles.scrollViewStyle,
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
              style={localStyles.listTouchable}
              onPress={() => {
                this.state.onChangeSelection(this.state.list[index], index);
                this.setState({listIsOpen: false});
              }}>
              <Text style={[localStyles.listItemText]}>{element}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>
    );
  }
}

const localStyles = StyleSheet.create({
  listItemText: {
    fontFamily: 'Arial-BoldMT',
    color: colors.black,
    fontSize: moderateScale(16),
  },
  displayedText: {
    fontFamily: 'Arial-BoldMT',
    color: colors.black,
  },
  modalStyle: {
    backgroundColor: colors.transparent,
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
  },
  scrollViewStyle: {
    width: scale(82.8),
    backgroundColor: colors.white,
    flex: 0,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 5,
    alignSelf: 'center',
    position: 'relative',
  },
  listTouchable: {
    flex: 1,
    paddingTop: verticalScale(17.92),
    paddingBottom: verticalScale(17.92),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAndListItemView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
