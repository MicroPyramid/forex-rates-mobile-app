import React from 'react';
import { View } from 'react-native';

const CardComponent = (props) => {
  return (
    <View style={[styles.constainerStyle, props.style]}>
      {props.children}
    </View>
  );
};

const styles = {
  constainerStyle: {
    borderWidth: 2,
    // padding: 25,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 2,
    // backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#e1e8ee',
    position: 'relative',
    // margin: 5,
    // marginRight: 5,
    // marginLeft: 20,
    borderRadius: 5,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
  }
};

export { CardComponent };
