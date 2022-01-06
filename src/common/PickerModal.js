import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Modal, PickerIOS, PickerItemIOS, Dimensions } from 'react-native';
import {CardComponent, headerStyles} from './index';

export class PickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: this.props.showPicker,
      iosSelectedDate: new Date,
      value: this.props.value
    }
  }

  componentWillReceiveProps(props) {
    if(props.showPicker !== this.state.showPicker) {
      this.setState({showPicker: props.showPicker})
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.showPicker}
        onRequestClose={() => {}}
        style={{border: 5}}
      >
        <View style={styles.containerStyle}>
          <CardComponent style={{ justifyContent: 'flex-end', backgroundColor: '#2363c3' }}>
            <TouchableOpacity
              onPress={this.props.onClose}
            >
              <Text style={styles.textStyle}>Done</Text>
            </TouchableOpacity>
          </CardComponent>
        </View>
        <View style={{ backgroundColor: '#F5FCFF' }}>
          <PickerIOS
            selectedValue={this.state.value}
            onValueChange={(value) => this.setState({value}, this.props.onChange(value))}
            mode='dropdown'
          >
            {
              this.props.currencies.map((currency) =>
                <PickerItemIOS label={currency}  value={currency} key={currency}/>
              )
            }
          </PickerIOS>
        </View>
      </Modal>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  pickerIosStyle: {
    width: Dimensions.get('window').width/2.5,
    height: Dimensions.get('window').height/3,
    // borderTopWidth: 1,
    // borderColor: '#fff',
  },
   textStyle: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 10
  }
}