
import React, { Component } from 'react';
import { 
  View, 
  Text,
  ListView, 
  StatusBar,
  BackHandler,
  Picker,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Header, fetch_get, CardComponent, Spinner } from '../common';
import { CountriesDetails, CountryCurrencies } from '../CountriesDetails';

import {LineChart} from 'react-native-charts-wrapper';

export default class Chart extends Component {
   constructor(props) {
  super(props);
    this.state = {
      today: formatDate(new Date),
      base: '',
      toCurrency: '',
      values: [{x: 3, y:88}],
      values2: [{x: 5, y: 10}],
      loading: false
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    // var date="12/22/2017"
    // var now=new Date(this.state.today);
    // now.setDate(now.getDate()-30)
    // console.log(now)
    
    // this.fetchChartValues()
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  getWeekData() {
    var weekDay = new Date()
    weekDay.setDate(weekDay.getDate() - 7 )
    this.fetchChartValues(formatDate(weekDay.toISOString()), this.state.today)
  }

  getMonthData() {

  }

  get3MonthsData() {

  }

  fetchChartValues(fromDate, toDate) {
    this.setState({ values: [], loading: true  })
    let toCurrency = this.state.toCurrency.split(' ')[2]
    fetch_get(`range?from_date=${fromDate}&end_date=${toDate}&symbols=${toCurrency}&base=${this.state.base.split(' ')[2]}`)
    .then((response) => {
      for(let i=0; i < response.length; i++){
        let x = parseInt(response[i].date.split('-')[2])
        let y = response[i].rates[toCurrency]
        this.state.values.push({x: x, y: y})
      }
      this.setState({ values: this.state.values }, () => { this.setState({ loading: false })})
      console.log(response)
      // this.setState({ 
      //   forExRates: response,
      //   base: response.base,
      //   loading: false
      // })
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    console.log(this.state.values, 'edrftgyhuji')
    return (
      <View style={styles.viewStyle}>
        <StatusBar
          backgroundColor="#ff0000"
          barstyle="light-content"
        />
        <Header headerText='Converter' />
        <View style={{flex: 1}}>
          <View style={styles.pickersView}>
            <Picker
              selectedValue={this.state.base}
              style={styles.pickerStyle}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => this.setState({ base: itemValue })}
            >
              <Picker.Item value='' color={'#fff'} label='Select Country' />
              {
                CountryCurrencies.map((currency) =>
                  <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                )
              }
            </Picker>
            <Picker
              selectedValue={this.state.toCurrency}
              style={styles.pickerStyle}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => this.setState({ toCurrency: itemValue })}
            >
              <Picker.Item value='' color={'#fff'} label='Select Country' />
              {
                CountryCurrencies.map((currency) =>
                  <Picker.Item label={currency} color={'#fff'} value={currency} key={currency}/>
                )
              }
            </Picker>
          </View>
          <View style={styles.datesView}>
            <TouchableOpacity 
              style={styles.dateSelectionView}
              onPress={() => {}}
            >
              <Text style={styles.dateSelectionText}>1 Year</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateSelectionView}
              onPress={() => {}}
            >
              <Text style={styles.dateSelectionText}>6 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateSelectionView}
              onPress={() => {}}
            >
              <Text style={styles.dateSelectionText}>3 Months</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateSelectionView}
              onPress={() => {}}
            >
              <Text style={styles.dateSelectionText}>1 Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateSelectionView}
              onPress={() => {this.getWeekData()}}
            >
              <Text style={styles.dateSelectionText}>1 Week</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
          {!this.state.loading &&
            <LineChart 
              style={styles.chart}
              data={{
                dataSets:[{
                  label: "Chart", 
                  values: this.state.values
                }]
              }}
              yAxis={{
                right: {enabled: false}
              }}
            />
          }
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
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
    backgroundColor: '#000'
  },
  container: {
    flex: 9,
    backgroundColor: '#F5FCFF'
  },
  baseView: {
    flex:1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: '#ff0000',
    fontFamily: 'Roboto_Italic',
    fontSize: 20
  },
  pickersView: {
    flex: 1,
    flexDirection: 'row'
  },
  pickerStyle: {
    width: Dimensions.get('window').width/2.3,
    height: Dimensions.get('window').height/20,
    borderWidth: 5,
    borderColor: '#ff0000',
    color: '#fff',
  },
  datesView: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 50
  },
  dateSelectionText: {
    color: 'white'
  },
  lineChartView: {
    flex: 9,
    backgroundColor: '#F5FCFF',
    color: 'red'
  },
  dateSelectionView: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#ff0000',
    borderColor: 'white',
    borderWidth: 1,
  },
  flagStyle: {
    width: 10, 
    height: 10
  },
  chart: {
    flex: 1
  }
}



