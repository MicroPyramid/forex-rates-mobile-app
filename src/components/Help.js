import React, { Component } from 'react'
import { 
  View, 
  Text,
  Linking,
  ScrollView,
  BackHandler,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Zocial';
import { Header, fetch_get, CardComponent, Card } from '../common';

export default class Help extends Component {
   constructor(props) {
    super(props);
    this.state = {
    };
  }

  openURL(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Not supported");
      }
    });
  }

  render() {
    return (
      <ScrollView style={styles.baseView}>
        <Header headerText='Help' />
        <View style={styles.baseView}>
          <View style={{ flex: 0.6, marginTop: 20 }}>
            <Text style={[styles.text, { fontSize: 13, textAlign: 'justify' }]}>
              {' '} This app is developed by {'\n'}
            </Text>
            <View style={{ alignItems: 'center'}}>
              <Text style={[styles.text, { fontWeight: 'bold', fontSize: 18 }]}>MicroPyramid Informatics Pvt. Ltd </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Text style={[styles.text, { lineHeight: 25 }]}>
                we are a diverse group of a custom software development team with huge experience in handling Real-time Web Applications, 
                Mobile application, Content Management Systems, e-Commerce and Single page applications.{'\n'}
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
              <Text style={[styles.text, { lineHeight: 25 }]}>
                We welcome your feedback and support raise, github ticket
                <Text 
                  style={[styles.text, { color: '#2b51ef', marginLeft: 2, marginRight: 2 }]}
                  onPress={() => this.openURL('https://github.com/MicroPyramid/forex-rates-mobile-app')}
                >
                  {' '} https://github.com/MicroPyramid/forex-rates-mobile-app {' '} 
                </Text>
                <Text style={styles.text}>
                  if you want to report a bug in this app. {'\n'}
                </Text>
              </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Text style={styles.text}>
                Need new features? Contact us here {'\n'}
              </Text>
              <Text 
                style={[styles.text, { color: '#2b51ef'}]}
                onPress={() => this.openURL('https://micropyramid.com/contact-india/')}
              > 
                https://micropyramid.com/contact-usa/ {'\n'}
              </Text>
              <Text style={[styles.text, { lineHeight: 25 }]}>
                ratesapi is a free API for current and historical foreign exchange rates published by European Central Bank. The rates are updated daily 3PM CET. 
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.4, margin: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.text, { fontSize: 20, fontFamily: 'Roboto-BlackItalic'}]}>Get in Touch with us:</Text>
            <Text style={[styles.text, { fontSize: 18 }]}>
              <Icon name="email" size={20} color="red"></Icon> hello@micropyramid.com
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Card style={{ backgroundColor: '#a3a3a3' }}>
                <Text style={[styles.text, { fontWeight: 'bold', color: '#fff' }]}>
                  USA {'\n'}
                </Text>
                <Text style={[styles.text, { color: '#fff' }]}>
                  3737 Mapleshade Ln,{'\n'}
                  Suite 102,{'\n'} 
                  Plano TX 75075, {'\n'}
                  +1 510 230 0949 {'\n'} {'\n'}
                </Text>
              </Card>
              <Card style={{ backgroundColor: '#a3a3a3'}}>
                <Text style={[styles.text, { fontWeight: 'bold', color: '#fff' }]}>
                  India {'\n'}
                </Text>
                <Text style={[styles.text, { color: '#fff' }]}>
                  Krishe Sapphire,{'\n'}
                  6th Floor, {'\n'}
                  Madhapur, Hyderabad,{'\n'}
                  India, 500081 {'\n'}
                  +91-850 009 9499 {'\n'}
                </Text>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = {
  baseView: {
    flex: 1, 
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  text: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center'
  }
}
