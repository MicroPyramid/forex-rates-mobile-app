import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Rates from './src/components/Rates';
import Converter from './src/components/Converter';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const backgroundColor = 'red';
// export const RatesTab = TabNavigator({
//   Rates: {
//     screen : Rates,
//     navigationOptions: {
//       tabBarLabel: 'Rates',
//       backgroundColor: 'balck'
//     }
//   },
//   Convert: {
//     screen: Rates,
//     navigationOptions: {
//       tabBarLabel: 'Converter'
//     }
//   },
//   Chart: {
//     screen: Rates,
//     navigationOptions: {
//       tabBarLabel: 'Chart'
//     }
//   },
// },
//   {
//     tabBarPosition: 'bottom',
//     tabBarComponent : TabBarBottom,
//   },
//   {
//     tabBarOptions: {
//       activeTintColor: 'white',  // Color of tab when pressed
//       inactiveTintColor: 'red',
//       // inactiveTintColor: '#000000',
//       showIcon: false,
//       showLabel: 'true',
//       labelStyle: {
//         fontSize: 16,
//         paddingBottom: 15
//       },
//       style: {
//         backgroundColor: 'black',
//         color: 'white',
//       },
//       indicatorStyle: {
//         width: 1,
//         color: '#000000',
//         backgroundColor: 'black'
//       },
//       tabStyle: {
//         width: 500
//       },
//     }
//   }
// );

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
      screen: Rates,
      navigationOptions: {
        title: 'Chart',
        tabBarIcon: ({ tintColor }) => (<Icon name='line-chart' size={20} color={tintColor} />)
      },
    },
  },
  {
    lazy: true,
    tabBarComponent: props => {
      // #f00000
      // const backgroundColor = props.position.interpolate({
      //   inputRange: [0, 1, 2],
      //   outputRange: ['orange', 'white', 'green'],
      // })
      return (
        <TabBarBottom
          {...props}
          style={{ 
            backgroundColor: backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          labelStyle={{
            fontSize: 15,
            marginBottom: ((deviceHeight * 4) / 55) * 0.1,
          }}
          // indicatorStyle= {{
          //   backgroundColor: '#ffffff',
          //   height: 0,
          // }}
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

