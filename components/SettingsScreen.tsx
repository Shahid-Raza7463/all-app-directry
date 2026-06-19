import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Styles from './common/Styles';

const SettingsScreen = ({navigation}) => {
  return (
    <View style={[Styles.contentcenter]}>
      <TouchableOpacity
        style={Styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={Styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
