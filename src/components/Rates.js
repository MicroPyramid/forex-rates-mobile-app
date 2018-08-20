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
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Flag from 'react-native-round-flags';
import LinearGradient from 'react-native-linear-gradient';
import { Header, fetch_get, CardComponent, Spinner } from '../common';
import headerStyles from '../common/HeaderStyles';
import { CountriesDetails, CountryCurrencies } from '../CountriesDetails';

export default class Rates extends Component {
 constructor(props) {
  super(props);
    this.state = {
      forExRates: [],
      base: 'USD',
      loading: false,
      searching: false,
      CountriesDetails: CountriesDetails,
      // pinCurrency: [],
      getPinnedCurrencies: []
      // dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
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
    }, () => { this.fetchForexRates() })
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  // AsyncStorage.getItem('contacts')
  // .then((contacts) => {
  //   const c = contacts ? JSON.parse(contacts) : [];
  //   c.push(con);
  //   AsyncStorage.setItem('contacts', JSON.stringify(c));
  // });

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    if(this.state.searching) {
      this.setState({ searching: false })
      return true;
    } else {
      this.props.navigation.goBack();
      return false;
    }
  }

  fetchForexRates(base=false, currency) {
    url = base ? `latest?base=${currency}` : 'latest';
    fetch_get(url)
    .then((response) => {
      this.setState({ 
        forExRates: response,
        base: response.base,
        loading: false
      })
      // this.state.getPinnedCurrencies.length > 0 ? this.state.getPinnedCurrencies.map((currency) =>
      this.state.CountriesDetails.forEach((country, index) => {
        if(this.state.getPinnedCurrencies.includes(country.currencies[0].code)) {
          this.state.CountriesDetails.move(index, 0)
        }   
      })
      this.setState({ CountriesDetails })
    })
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
      this.state.CountriesDetails.move(index, 0)
      // this.state.CountriesDetails.splice(index, 1)
      // this.state.CountriesDetails.splice(0, 1, this.state.CountriesDetails[index])
      this.setState({ getPinnedCurrencies: this.state.getPinnedCurrencies.concat(currency), CountriesDetails })
    } else {
      this.state.CountriesDetails.move(index, this.state.getPinnedCurrencies.length)
      this.setState({ getPinnedCurrencies: this.state.getPinnedCurrencies.filter((obj) => obj !== currency), CountriesDetails })
    }
    // let pinCurrencies = this.state.getPinnedCurrencies.push(currency)
    AsyncStorage.setItem('@pinCurrency:key', JSON.stringify(this.state.getPinnedCurrencies));
  }
  
  render() {
    return (
      <View style={styles.viewStyle}>
        <StatusBar
          backgroundColor="red"
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
        <View style={{ flex: 1 }}>
          <View style={styles.baseView}>
            <Text style={styles.baseTextStyles}>Select Base Country</Text>
            <Picker
              selectedValue={this.state.base}
              style={styles.pickerStyle}
              onValueChange={(itemValue, itemIndex) => this.setState({ base: itemValue }, () => { this.fetchForexRates(true, itemValue)} )}
              pickerStyleType={false}
              mode='dropdown'
            >
              {
                CountryCurrencies.map((currency) =>
                  <Picker.Item label={currency} color={'#000'} value={currency} key={currency}/>
                )
              }
            </Picker>
          </View>
          {(!this.state.loading && this.state.forExRates.rates) ? 
            <ScrollView style={styles.countriesView}>
              { this.state.CountriesDetails.map((country, index) =>
                Object.entries(this.state.forExRates.rates).map(([key, value]) =>
                country.currencies[0].code === key ?
                  <View style={{ backgroundColor: '#000'}} key={key}>
                    <CardComponent key={country.name}>
                      <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
                        <Flag code={country.alpha2Code} style={{ width: 50, height: 50 }} />
                      </View>
                      <View style={{ flex: 0.5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#fff', fontWeight: '400' }}>{country.name}</Text>
                        <Text style={{ fontSize: 13, color: '#fff' }}>{country.currencies[0].code}</Text>
                      </View>
                      <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 19, color: '#fff' }}>{value}</Text>
                      </View>
                      <TouchableOpacity 
                        style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', paddingRight: 5 }}
                        onPress={() => this.pinCurrency(key, index, this.state.getPinnedCurrencies.includes(key) ? 'unpin' : 'pin') }
                      >
                        <Icon name="pin" size={25} color={this.state.getPinnedCurrencies.includes(key) ? 'red' : "#ccc" }/>
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
      </View> 
    );
  }
}

const styles = {
  viewStyle: {
    flex: 1,
    // backgroundColor: '#fff'
  },
  baseView: {
    flex: 0.17,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'red'
    // flxeDirection: 'column'
  },
  pickerStyle: {
    width: Dimensions.get('window').width/1.5,
    height: Dimensions.get('window').height/15,
    borderTopWidth: 1,
    borderColor: '#fff',
    // backgroundColor: '#fff'
  },
  countriesView: {
    flex: 0.8,
    backgroundColor: 'red'
  },
  baseTextStyles: {
    fontSize: 16,
    color: '#000'
  },
  imageStyle: {
    width: 35,
    height: 40,
  },
  searchinput:{
    flex:10,
    paddingLeft:12,
    // fontFamily: 'Roboto-regular',
    fontSize:16,
    color: '#fff'
  },
}

