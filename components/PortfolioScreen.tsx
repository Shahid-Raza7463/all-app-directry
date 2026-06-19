import React from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Styles from './common/Styles';
import ExpertaffDetailsScreen from './ExpertaffDetailsScreen';

const PortfolioScreen = ({navigation}) => {
  const calculaterapp = require('../assets/images/portfolio/project-expertaff1.png');

  return (
    <ScrollView style={Styles.containerp}>
      <Text style={Styles.headingp}>Portfolio</Text>
      <Text style={Styles.paragraphp}>
        Welcome to my portfolio. Here you'll find a collection of projects that
        highlight my expertise in software development and web technologies.
        Each project demonstrates my dedication to creating effective solutions
        and my passion for coding.
      </Text>

      <TouchableOpacity
        style={Styles.cardp}
        onPress={() => navigation.navigate('ExpertaffDetails')}>
        <Text style={Styles.projectTitlep}>Expertaff</Text>
        <Image source={calculaterapp} style={Styles.imagep} />
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.buttonp}
        onPress={() => navigation.navigate('Home')}>
        <Text style={Styles.buttonTextp}>Go to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const PortfolioStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    // <Stack.Navigator initialRouteName="ExpertaffDetails">
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="PortfolioMain" // Renamed to avoid conflict
        component={PortfolioScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ExpertaffDetails"
        component={ExpertaffDetailsScreen}
        options={{title: 'Expertaff Details'}}
      />
    </Stack.Navigator>
  );
};

// Export PortfolioStack to include navigation
export default PortfolioStack;
