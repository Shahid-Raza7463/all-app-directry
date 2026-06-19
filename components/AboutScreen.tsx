import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Styles from './common/Styles';

const AboutScreen = ({navigation}) => {
  return (
    <View style={[Styles.contentcenter]}>
      <Text style={Styles.heading}>About</Text>
      {/* Text paragraph */}
      <Text style={Styles.paragraph}>
        Hey there, Name's Shahid Raza and I'm a Full Stack Web Developer, worked
        @TrakAff as a Laravel backend web developer and currently working as
        Laravel backend web developer @Capitall. I'm proficient in working with
        and implementing backend for web apps using Php, Laravel, MySQL, Ajax,
        JSON, JavaScript, React Js, Node Js, HTML, CSS, jQuery, Bootstrap. And I
        enjoy taking on new challenges. I have 2 years of experience in Backend
        Web Development.
      </Text>
      {/* Navigation button */}
      <TouchableOpacity
        style={Styles.button}
        onPress={() => navigation.navigate('Home')}>
        <Text style={Styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AboutScreen;
