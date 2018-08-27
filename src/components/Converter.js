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
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Header, fetch_get, CardComponent } from '../common';
import { CountriesDetails, CountryCurrencies } from '../CountriesDetails';


export default class Converter extends Component {
 constructor(props) {
  super(props);
    this.state = {
      from: '',
      to: '',
      amount: 0,
      totalAmount: 0,
      selectedDate: formatDate(new Date),
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }
 
  converter(base=false, currency) {
    const { to, amount, totalAmount} = this.state;
    let getFromCurrency = this.state.from.split(' ')[2]
    let getToCurrency = to.split(' ')[2]
    if(this.state.from && to) {
      fetch_get(`${this.state.selectedDate}?base=${getFromCurrency}&symbols=${getToCurrency}`)
      .then((response) => {
        let totalAmount = this.state.amount > 0 ? response.rates[getToCurrency] * this.state.amount : response.rates[getToCurrency]; 
        this.setState({ totalAmount })
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
          this.setState({ selectedDate: formatDate(date) }, () => this.converter());
        }
        this.setState(newState);
      } catch ({ code, message }) {
        console.warn(`Error in example '${stateKey}': `, message);
      }
    }  
  };

  render() {
    return (
      <View style={styles.viewStyle}>
        <StatusBar
          backgroundColor="#ff0000"
          barstyle="light-content"
        />
        <Header headerText='Converter' />
        <ScrollView contentContainerStyle={styles.baseView}>
          <View style={{ flex: 2 }}></View>
            <View style={styles.convertInputs}>
              <Text style={styles.textView}>Date</Text>
              <View style={styles.dateView}>
                <Text style={styles.dateText}>{this.state.selectedDate}</Text>
                <TouchableOpacity
                  onPress={this.showDatePicker.bind(this, 'max', {
                  date: this.state.maxDate,
                  maxDate: new Date() })}
                >
                <Icon name="calendar" size={25} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.convertInputs}>
              <Text style={styles.textView}>From</Text>
              <Picker
                selectedValue={this.state.from}
                style={styles.pickerStyle}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ from: itemValue }, () => { this.converter() } )}
              >
                <Picker.Item value='' color={'#fff'} label='Select Country' />
                {
                  CountryCurrencies.map((currency) =>
                    <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                  )
                }
              </Picker>
            </View>
            <View style={styles.convertInputs}>
              <Text style={styles.textView}>To</Text>
              <Picker
                selectedValue={this.state.to}
                style={styles.pickerStyle}
                mode='dropdown'
                onValueChange={(itemValue, itemIndex) => this.setState({ to: itemValue }, () => { this.converter() } )}
              >
                <Picker.Item value='' color={'#fff'} label='Select Country' />
                {
                  CountryCurrencies.map((currency) =>
                    <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                  )
                }
              </Picker>
            </View>
            <View style={styles.convertInputs}>
              <Text style={styles.textView}>Amount</Text>
              <TextInput
                style={styles.inputStyles}
                onChangeText={(amount) => this.setState({amount}, () => { this.converter() } )}
                value={this.state.amount}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.convertInputs}>
              <Text style={styles.textView}>Total</Text>
              <View style={styles.totalAmountView}>
                <Text style={styles.totalAmountText}>{this.state.totalAmount}</Text>
              </View>
            </View>
          <View style={{ flex: 3 }}></View>
        </ScrollView>
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
    width: Dimensions.get('window').width/2.3,
    height: Dimensions.get('window').height/25,
    borderWidth: 5,
    borderColor: '#ff0000',
    color: 'white',
  },
  viewStyle: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  baseView: {
    flex: 1,
    // margin: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  textView: {
    fontSize: 18,
    color: '#ff0000',
    fontFamily: 'Roboto-Medium',
    paddingRight: 10
  },
  inputStyles: {
    width: Dimensions.get('window').width/2.3,
    height: Dimensions.get('window').height/20,
    borderWidth: 1, 
    borderColor: '#ff0000' ,
    // margin: 5,
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  convertInputs: {
    margin: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  totalAmountView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width/3,
    height: Dimensions.get('window').height/10,
    backgroundColor: '#ff0000',
    margin: 20,
    marginTop: 50
  },
  totalAmountText: {
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  dateView: {
    width: Dimensions.get('window').width/2,
    height: Dimensions.get('window').height/20,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    // margin: 10
  },
  dateText : {
    fontSize: 18, 
    color: '#fff'
  }
}
