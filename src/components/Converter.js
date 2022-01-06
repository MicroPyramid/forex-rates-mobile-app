import React, { Component } from 'react';
import { 
  View, 
  Text,
  ListView, 
  Picker,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  DatePickerAndroid,
  Platform,
  StatusBar,
  BackHandler,
  PickerItemIOS,
  PickerIOS,
  DatePickerIOS,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header, fetch_get, CardComponent, DateModal, PickerModal } from '../common';
import { CountriesDetails, CountryCurrencies } from '../CountriesDetails';


export default class Converter extends Component {
 constructor(props) {
  super(props);
    this.state = {
      today: formatDate(new Date),
      from: ' 🇩🇪 EUR',
      to: ' 🇺🇸 USD',
      amount: null,
      totalAmount: 1,
      selectedDate: formatDate(new Date),
      showDatePicker: false,
      iosSelectedDate: new Date,
      showToPicker: false,
      showFromPicker: false,
      error: false
    };
  }

  componentDidMount() {
    this.converter()
  }
 
  converter(base=false, currency) {
    const { to, amount, totalAmount} = this.state;
    let getFromCurrency = this.state.from.split(' ')[2]
    let getToCurrency = to.split(' ')[2]
    if(this.state.from && to) {
      fetch_get(`${this.state.selectedDate}?base=${getFromCurrency}&symbols=${getToCurrency}`)
      .then((response) => {
        if(response.status) {
          this.setState({ error: true })
        } else {
          let totalAmount = amount !== null ? response.rates[getToCurrency] * amount : response.rates[getToCurrency]; 
          this.setState({ totalAmount, error: false, amount: amount !== null ? amount : '1' })
        }
      })
    }
  }

  showDatePicker = async(stateKey, options) => {
    if (Platform.OS === 'android') {
      try {
        var newState = {};
        const { action, year, month, day } = await DatePickerAndroid.open(options);
        if (action === DatePickerAndroid.dismissedAction) {
          newState[stateKey + 'Text'] = 'dismissed';
        } else {
          var date = new Date(year, month, day);
          newState[stateKey + 'Text'] = date.toLocaleDateString();
          newState[stateKey + 'Date'] = date;
          this.setState({ selectedDate: formatDate(date) }, this.converter);
        }
        this.setState(newState);
      } catch ({ code, message }) {
        console.warn(`Error in example '${stateKey}': `, message);
      }
    }  
  };

  exchangeValues(from, to) {
    this.setState({ from: to, to: from }, this.converter)
  }

  render() {
    return (
      <View style={[styles.viewStyle, {opacity: (this.state.showDatePicker || this.state.showFromPicker || this.state.showToPicker) ? 0.2 : 1}]}>
        <StatusBar
          backgroundColor="#2363c3"
          barstyle="light-content"
        />
        <Header headerText='Rates' subHeaderText='Converter' />
        {!this.state.error ?
          <ScrollView contentContainerStyle={styles.baseView}>
            <View style={{ flex: 1 }}></View>
              <Text style={{ color: '#000', fontSize: 25, fontFamily: 'Roboto-BoldItalic' }}>Converter{'\n'} {'\n'}</Text>
              <View style={styles.convertInputs}>
                <Text style={styles.textView}>Date</Text>
                  <TouchableOpacity
                    onPress={Platform.OS === 'android' ? this.showDatePicker.bind(this, 'max', {
                    date: this.state.maxDate,
                    maxDate: new Date() }) : () => this.setState({showDatePicker: true})}
                    style={styles.dateView}
                  >
                    <Text style={styles.dateText}>{this.state.selectedDate === this.state.today ? 'Today' : this.state.selectedDate}</Text>
                    <Icon name="calendar" size={25} color="#000" />
                  </TouchableOpacity>
              </View>
            <DateModal
              showDatePicker={this.state.showDatePicker}
              onDateChange={(iosSelectedDate) => this.setState({iosSelectedDate, selectedDate: formatDate(iosSelectedDate)})}
              onClose={() =>
                this.setState({ showDatePicker: false }, this.converter)
              }
            />
            <View style={styles.convertInputs}>
              {
                Platform.OS === 'android' ?
                <Picker
                  selectedValue={this.state.from}
                  style={[styles.pickerStyle, { marginRight: 20 }]}
                  mode='dropdown'
                  onValueChange={(itemValue, itemIndex) => this.setState({ from: itemValue }, this.converter )}
                >
                  {
                    CountryCurrencies.map((currency) =>
                      <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                    )
                  }
                </Picker> :
                <TouchableOpacity
                  style={[styles.pickerIosStyle, {marginRight: 20}]}
                  onPress={() => this.setState({ showFromPicker: !this.state.showFromPicker})}
                >
                  <Text style={styles.baseTextStyles}>{this.state.from}</Text>
                </TouchableOpacity>
              }
              <PickerModal
                value={this.state.from}
                showPicker={this.state.showFromPicker}
                currencies={CountryCurrencies}
                onChange={(from) => this.setState({from})}
                onClose={() => this.setState({ showFromPicker: false }, this.converter)}
              />
              <TouchableOpacity
                onPress={() => this.exchangeValues(this.state.from, this.state.to)}
              >
                <Icon name="exchange" size={25} color="#000" style={{ marginTop: 5 }} />
              </TouchableOpacity>
                {
                Platform.OS === 'android' ?
                <Picker
                  selectedValue={this.state.to}
                  style={[styles.pickerStyle, { marginLeft: 20 }]}
                  mode='dropdown'
                  onValueChange={(itemValue, itemIndex) => this.setState({ to: itemValue }, this.converter )}
                >
                  {
                    CountryCurrencies.map((currency) =>
                      <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                    )
                  }
                </Picker> :
                <TouchableOpacity
                  style={[styles.pickerIosStyle, {marginLeft: 20}]}
                  onPress={() => this.setState({ showToPicker: !this.state.showToPicker})}
                >
                  <Text style={styles.baseTextStyles}>{this.state.to}</Text>
                </TouchableOpacity>
              }
              <PickerModal
                value={this.state.to}
                showPicker={this.state.showToPicker}
                currencies={CountryCurrencies}
                onChange={(to) => this.setState({to})}
                onClose={() => this.setState({ showToPicker: false }, this.converter)}
              />
            </View>
            <View style={styles.convertInputs}>
                <Text style={[styles.textView, { marginTop: 10 }]}>Amount</Text>
                <TextInput
                  style={styles.inputStyles}
                  onChangeText={(amount) => this.setState({amount}, () => { this.converter() } )}
                  value={this.state.amount}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.convertInputs}>
                { CountriesDetails.map((country) =>
                  this.state.to.split(' ')[2] === country.currencies[0].code &&
                  <View key={country.alpha2Code} style={styles.totalAmountView}>
                    <Text style={styles.totalAmountText}>{ country.currencies[0].symbol } {this.state.totalAmount ? this.state.totalAmount.toFixed(3) : 1 }</Text>
                  </View>
                )}
              </View>
          <View style={{ flex: 3 }}></View>
        </ScrollView>
        :
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.textStyles, {fontSize: 16, lineHeight: 25 }]}>
              Currency source not available.{'\n'} Please try after some time
            </Text>
          </View>
        }
      </View>
    );
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

const styles = {
  pickerStyle: {
    width: Dimensions.get('window').width/3.1,
    height: Dimensions.get('window').height/21,
    borderColor: '#ff0000',
    color: 'white',
    backgroundColor: '#2363c3'
  },
  pickerIosStyle: {
    width: Dimensions.get('window').width/3.1,
    height: Dimensions.get('window').height/21,
    borderColor: '#ff0000',
    color: 'white',
    backgroundColor: '#2363c3'
  },
  baseTextStyles: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5
  },
  viewStyle: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  baseView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textView: {
    fontSize: 18,
    color: '#666666',
    fontFamily: 'Roboto-Medium',
    paddingRight: 10
  },
  inputStyles: {
    width: Dimensions.get('window').width/2.3,
    height: Dimensions.get('window').height/18,
    borderBottomWidth: 1, 
    borderColor: '#2363c3' ,
    color: '#000',
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    paddingBottom: 0
  },
  convertInputs: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  totalAmountView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width/2.0,
    height: Dimensions.get('window').height/16,
    borderRadius: Dimensions.get('window').width/2.1,
    margin: 20,
    marginTop: 30,
    backgroundColor: '#61b207'
  },
  totalAmountText: {
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
  },
  dateView: {
    width: Dimensions.get('window').width/2.1,
    height: Dimensions.get('window').height/20,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
  },
  dateText : {
    fontSize: 18, 
    color: '#000'
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textStyles: {
    fontSize: 13, 
    color: '#000', 
    fontFamily: 'Roboto-Medium'
  },
}
