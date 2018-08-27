import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Rates from './src/components/Rates';
import Converter from './src/components/Converter';
import Chart from './src/components/Chart';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const backgroundColor = '#ff0000';

export const RatesTab = TabNavigator(
  {
    Tab1: {
      screen: Rates,
      navigationOptions: {
        title: 'Rates',
        tabBarIcon: ({ tintColor }) => (<Icon name='dollar' size={20} color={tintColor} />)
      },
    },
    Tab2: {
      screen: Converter,
      navigationOptions: {
        title: 'Converter',
        tabBarIcon: ({ tintColor }) => (<Icon name='exchange' size={20} color={tintColor} />)
      },
    },
    Tab3: {
      screen: Chart,
      navigationOptions: {
        title: 'Chart',
        tabBarIcon: ({ tintColor }) => (<Icon name='line-chart' size={20} color={tintColor} />)
      },
    },
  },
  {
    lazy: true,
    tabBarComponent: props => {
      return (
        <TabBarBottom
          {...props}
          style={{ 
            backgroundColor: backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            height: (deviceHeight / 14)
          }}
          labelStyle={{
            fontSize: 15,
            marginBottom: ((deviceHeight * 4) / 55) * 0.1,
          }}
        />
      );
    },
    swipeEnabled: true,
    animationEnabled: false,
    tabBarPosition: 'bottom',
    initialRouteName: 'Tab1',
    tabBarOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: backgroundColor,
      inactiveTintColor: 'white',
      inactiveBackgroundColor: 'black',
      marginTop: 50,
      paddingTop: 50
    },
    labelStyle: {
      fontSize: 20,
      marginTop: 50,
      paddingTop: 50
      // fontFamily: 'Muli'
    },
  },
);


export default class App extends Component<Props> {
  render() {
    return (
      <RatesTab />
    );
  }
}
