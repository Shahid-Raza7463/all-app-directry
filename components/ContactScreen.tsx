import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Styles from './common/Styles';

const ContactScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Handle form submission (API call, validation, etc.)
    console.log('Form Submitted', {name, email, subject, message});
  };

  return (
    // <ScrollView contentContainerStyle={Styles.container}>
    <ScrollView style={Styles.container}>
      <Text style={Styles.headingcontact}>Contact Me</Text>

      {/* Address Info */}
      <View style={Styles.infoWrap}>
        <View style={Styles.infoItem}>
          <Text style={Styles.infoTitle}>Address</Text>
          <Text>Laxmi Nagar Metro Station, New Delhi</Text>
        </View>
        <View style={Styles.infoItem}>
          <Text style={Styles.infoTitle}>Call Us</Text>
          <Text>+917488952139</Text>
        </View>
        <View style={Styles.infoItem}>
          <Text style={Styles.infoTitle}>Email Us</Text>
          <Text>shahidraza7463@gmail.com</Text>
        </View>
      </View>

      {/* Contact Form */}
      <View style={Styles.form}>
        <TextInput
          style={Styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={Styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={Styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          style={[Styles.input, Styles.textarea]}
          placeholder="Message"
          multiline
          numberOfLines={4}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={Styles.buttoncontact} onPress={handleSubmit}>
          <Text style={Styles.buttonTextcontact}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Google Map Embed */}
      {/* <View style={Styles.mapEmbed}>
        <Text>Location on Map:</Text>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.974898484312!2d77.27280758321282!3d28.630514405676287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfcad2277af7d%3A0xe68dd5cbcfe7d692!2sLaxmi%20Nagar%20Metro%20Station!5e0!3m2!1sen!2sus!4v1725388219908!5m2!1sen!2sus"
          style={Styles.map}
          allowFullScreen
          loading="lazy"></iframe>
      </View> */}
      {/* <View style={Styles.containermap}>
        <Text>Location on Map:</Text>
        <WebView
          source={{
            uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.974898484312!2d77.27280758321282!3d28.630514405676287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfcad2277af7d%3A0xe68dd5cbcfe7d692!2sLaxmi%20Nagar%20Metro%20Station!5e0!3m2!1sen!2sus!4v1725388219908!5m2!1sen!2sus',
          }}
          style={Styles.mapstyle}
        />
      </View> */}
      <View style={[Styles.contentcenter]}>
        <TouchableOpacity
          style={Styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={Styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ContactScreen;
