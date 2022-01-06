import React, {Component} from 'react';
import { Text, View, TouchableOpacity, Modal, DatePickerIOS } from 'react-native';
import {CardComponent, headerStyles} from './index';

export class DateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDatePicker: this.props.showDatePicker,
      iosSelectedDate: new Date
    }
  }

  componentWillReceiveProps(props) {
    if(props.showDatePicker !== this.state.showDatePicker) {
      this.setState({showDatePicker: props.showDatePicker})
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.showDatePicker}
        onRequestClose={() => {}}
        style={{border: 5}}
      >
        <View style={styles.containerStyle}>
          <CardComponent style={{ justifyContent: 'flex-end', backgroundColor: '#2363c3' }}>
            <TouchableOpacity
              onPress={this.props.onClose}
            >
              <Text style={styles.textStyle}> Done</Text>
            </TouchableOpacity>
          </CardComponent>
        </View>
        <View style={{ backgroundColor: '#F5FCFF' }}>
          <DatePickerIOS
            date={this.state.iosSelectedDate}
            onDateChange={(iosSelectedDate) => this.setState({iosSelectedDate}, this.props.onDateChange(iosSelectedDate))}
            maximumDate={new Date()}
            mode='date'
            style={{ height: 220 }}
          />
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
   textStyle: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 10
  }
}