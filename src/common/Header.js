import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import headerStyles from './HeaderStyles';

const Header = (props) => {
  return (
    <View style={headerStyles.viewStyle}>
      <View style={headerStyles.headerViewStyle}>
        <Text style={headerStyles.headerStyle}>{props.headerText}</Text>
      </View>
    </View>
  );
};

export { Header };
