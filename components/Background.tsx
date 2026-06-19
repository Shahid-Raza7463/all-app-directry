import React from 'react';
import {View, ImageBackground} from 'react-native';
import Styles from './common/Styles';

const Background = ({children}) => {
  return (
    <View style={[Styles.contentcenter]}>
      <ImageBackground
        source={require('../assets/images/leaves.jpg')}
        style={{height: '100%'}}
      />
      <View style={Styles.setPosition}>{children}</View>
    </View>
  );
};

export default Background;
