import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from './common/Styles';

const HomeScreen = ({navigation}) => {
  const openURL = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  const defaultImage = require('../assets/images/FB_IMG_1545560289018.jpg');
  return (
    // <ScrollView contentContainerStyle={Styles.container}>
    <ScrollView>
      <View style={[Styles.contentcenter]}>
        <Text style={Styles.heading}>Welcome to My Portfolio</Text>
        <Image source={defaultImage} style={[Styles.image]} />
        <View style={Styles.buttonGroup}>
          <TouchableOpacity
            style={Styles.button}
            onPress={() => navigation.navigate('Doctor')}>
            <Text style={Styles.buttonText}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.button}
            onPress={() => navigation.navigate('Auto')}>
            <Text style={Styles.buttonText}>Auto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.button}
            onPress={() => navigation.navigate('Car')}>
            <Text style={Styles.buttonText}>Car</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.button}
            onPress={() => navigation.navigate('Helper')}>
            <Text style={Styles.buttonText}>Helper</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.button}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={Styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
        <View style={Styles.socialLinks}>
          <Text style={Styles.socialHeading}>Link</Text>
          <View style={Styles.icons}>
            <TouchableOpacity
              onPress={() => openURL('https://wa.me/917488952139')}
              style={Styles.iconButton}>
              <Icon name="whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                openURL(
                  'https://www.facebook.com/share/UbuEW2ucYCpR4MBK/?mibextid=qi2Omg',
                )
              }
              style={Styles.iconButton}>
              <Icon name="facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openURL('#')}
              style={Styles.iconButton}>
              <Icon name="instagram" size={24} color="#C13584" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                openURL('https://github.com/Shahid-Raza7463?tab=repositories')
              }
              style={Styles.iconButton}>
              <Icon name="github" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                openURL('https://www.linkedin.com/in/mdshahidraza7886')
              }
              style={Styles.iconButton}>
              <Icon name="linkedin" size={24} color="#0077B5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
