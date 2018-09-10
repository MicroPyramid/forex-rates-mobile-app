import React, { Component } from 'react';
import { 
  View, 
  Text,
  ListView, 
  Picker,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  StatusBar,
  AsyncStorage,
  DatePickerAndroid,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Flag from 'react-native-round-flags';
import { Header, fetch_get, CardComponent, Spinner } from '../common';
import headerStyles from '../common/HeaderStyles';
import { CountriesDetails, CountryCurrencies } from '../CountriesDetails';

export default class Rates extends Component {
 constructor(props) {
  super(props);
    this.state = {
      today: formatDate(new Date),
      forExRates: [],
      base: ' 🇩🇪 EUR',
      loading: false,
      searching: false,
      CountriesDetails: CountriesDetails,
      getPinnedCurrencies: [],
      selectedDate: formatDate(new Date),
      error: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  async componentDidMount() {
    // await AsyncStorage.removeItem('@pinCurrency:key')
    let getPinnedCurrencies = await AsyncStorage.getItem('@pinCurrency:key')
    if (getPinnedCurrencies !== null){
      getPinnedCurrencies = JSON.parse(getPinnedCurrencies);
    } else {
      getPinnedCurrencies = [];
    }
    this.setState({ 
      getPinnedCurrencies: getPinnedCurrencies, 
      loading: true 
    }, () => { this.fetchForexRates(); this.sortPinCountries() })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  handleBackButtonClick() {
    if(this.state.searching) {
      this.setState({ searching: false, CountriesDetails: CountriesDetails }, () => { this.sortPinCountries() })
      return true;
    } else {
      return false;
    }
  }

  fetchForexRates(base=false, currency=this.state.base) {
    let getCurrency = currency.split(' ')[2]
    fetch_get(`${this.state.selectedDate}?base=${getCurrency}`)
    .then((response) => {
      if(response.status) {
        this.setState({ error: true })
      } else {
        this.setState({ 
          forExRates: response,
          error: false,
          loading: false
        })
      }
    })
  }

  sortPinCountries() {
    this.state.CountriesDetails.forEach((country, index) => {
      if(this.state.getPinnedCurrencies.includes(country.currencies[0].code)) {
        this.state.CountriesDetails.unshift(this.state.CountriesDetails.splice(index, 1)[0]);
      }   
    })
    this.setState({ CountriesDetails })
  }

  setBase(base) {
    this.setState({ base })
    this.fetchForexRates(true, base)
  }

  searchItems(searchedCountry) {
    if(searchedCountry === ' ') {
      this.setState({ CountriesDetails })
    } else {
      var countries = CountriesDetails.filter(function (country) {
        return (country.name.toLowerCase().includes(searchedCountry.toLowerCase()));
      });
      this.setState({ CountriesDetails: countries })
    }
  }

  pinCurrency(currency, index, pin=true) {
    if(pin) {
      if(!this.state.searching) {
        this.state.CountriesDetails.unshift(this.state.CountriesDetails.splice(index, 1)[0]);
        this.setState({ CountriesDetails })
      }
      this.setState({ 
        getPinnedCurrencies: this.state.getPinnedCurrencies.concat(currency),
      }, () => { AsyncStorage.setItem('@pinCurrency:key', JSON.stringify(this.state.getPinnedCurrencies)) })
    } else {
      if(!this.state.searching) {
        let unpin = this.state.CountriesDetails.splice(index, 1)[0];
        this.state.CountriesDetails.splice(this.state.getPinnedCurrencies.length -1, 0, unpin);
        this.setState({ CountriesDetails }) 
      }
      this.setState({ 
        getPinnedCurrencies: this.state.getPinnedCurrencies.filter((obj) => obj !== currency), 
      }, () => { AsyncStorage.setItem('@pinCurrency:key', JSON.stringify(this.state.getPinnedCurrencies)) })
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
          this.setState({ selectedDate: formatDate(date)}, () => this.fetchForexRates() );
        }
        this.setState(newState);
      } catch ({ code, message }) {
        console.warn(`Error in example '${stateKey}': `, message);
      }
    }  
  };
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <StatusBar
          backgroundColor="#2363c3"
          barstyle="light-content"
        />
        <View>
          <View style={headerStyles.viewStyle}>
            {this.state.searching ?
              <TextInput
                placeholder= "Search by Country"
                underlineColorAndroid = 'transparent'
                onChangeText={this.searchItems.bind(this)}
                style={styles.searchinput}
                ref={(input) => { this.textInput = input; }}
                placeholderTextColor={'#ddd'}
                selectionColor={'#fff'}
              />
            :
              <View style={headerStyles.headerViewStyle}>
                <Text style={headerStyles.headerStyle}>Rates</Text>
                <Icon name="search" size={20} color="#000" onPress={() => this.setState({ searching: true }, () => { this.textInput.focus() }) } />
              </View>
            }
          </View>
        </View>
        {!this.state.error ?
          <View style={{ flex: 1 }}>
            <View style={styles.baseView}>
              <Picker
                selectedValue={this.state.base}
                style={styles.pickerStyle}
                onValueChange={(itemValue, itemIndex) => this.setState({ base: itemValue }, () => { this.fetchForexRates(true, itemValue)} )}
                pickerStyleType={false}
                mode='dropdown'
              >
                {
                  CountryCurrencies.map((currency) =>
                    <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                  )
                }
              </Picker>
              <TouchableOpacity
                onPress={this.showDatePicker.bind(this, 'max', {
                date: this.state.maxDate,
                maxDate: new Date() })}
                style={{ flex: 0.6, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}
              >
                <Text style={{ color: '#fff', fontSize: 18 }}>{this.state.selectedDate === this.state.today ? 'Today' : this.state.selectedDate}</Text>
                <Icon name="calendar" size={20} color="#000" />
              </TouchableOpacity>
            </View>
            {(!this.state.loading && this.state.forExRates.rates) ? 
              <ScrollView style={styles.countriesView}>
                { this.state.CountriesDetails.map((country, index) =>
                  Object.entries(this.state.forExRates.rates).map(([key, value]) =>
                  country.currencies[0].code === key ?
                    <View style={{ backgroundColor: '#fff'}} key={key}>
                      <CardComponent key={country.name}>
                        <View style={styles.cardView}>
                          <Flag code={country.alpha2Code} style={styles.flagStyle} />
                        </View>
                        <View style={[ styles.cardView, {flex: 0.4, alignItems: 'flex-start'}]}>
                          <Text style={[styles.textStyles, {fontSize: 17}]}>{country.name}</Text>
                          <Text style={styles.textStyles}>{country.currencies[0].code}</Text>
                        </View>
                        <View style={[ styles.cardView, {flex: 0.4, alignItems: 'flex-end'}]}>
                          <Text style={[styles.textStyles, {fontSize: 21}]}>{ country.currencies[0].symbol } { value }</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.pinStyle}
                          onPress={() => this.pinCurrency(key, index, this.state.getPinnedCurrencies.includes(key) ? false : true) }
                        >
                          <Icon name="pin" size={18} color={this.state.getPinnedCurrencies.includes(key) ? '#2363c3' : "#ccc" }/>
                        </TouchableOpacity>
                      </CardComponent>
                    </View>
                  : 
                    null
                  )
                )}
              </ScrollView>
            :
              <Spinner />
            }
          </View>
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
  viewStyle: {
    flex: 1,
  },
  baseView: {
    flex: 0.13,
    justifyContent: 'space-around',
    backgroundColor: '#2363c3',
    flexDirection: 'row'
  },
  cardView: {
    flex: 0.2, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  pickerStyle: {
    width: Dimensions.get('window').width/2.5,
    height: Dimensions.get('window').height/9,
    borderTopWidth: 1,
    borderColor: '#fff',
    // marginRight: 15
  },
  countriesView: {
    flex: 0.8,
    backgroundColor: '#000'
  },
  baseTextStyles: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Roboto-BoldItalic'
  },
  imageStyle: {
    width: 35,
    height: 40,
  },
  searchinput:{
    flex:10,
    paddingLeft:12,
    fontSize:16,
    color: '#fff'
  },
  textStyles: {
    fontSize: 13, 
    color: '#000', 
    fontFamily: 'Roboto-Medium'
  },
  pinStyle: {
    flex: 0.1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingRight: 5
  },
  flagStyle: {
    width: 50, 
    height: 50
  }
}
