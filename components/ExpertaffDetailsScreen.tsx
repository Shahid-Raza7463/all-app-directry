import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Styles from './common/Styles';

// const ExpertaffDetailsScreen = ({navigation}) => {
//   return (
//     <View style={[Styles.contentcenter]}>
//       <Text style={Styles.heading}>Expertaff</Text>
//       {/* Text paragraph */}
//       <Text style={Styles.paragraph}>This is my expertaff project</Text>
//       {/* Navigation button */}
//       <TouchableOpacity
//         style={Styles.button}
//         onPress={() => navigation.navigate('Home')}>
//         <Text style={Styles.buttonText}>Go to Home</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const ExpertaffDetailsScreen = () => {
  const expertAff1 = require('../assets/images/portfolio/project-expertaff1.png');
  const expertAff2 = require('../assets/images/portfolio/project-expertaff1.png');
  const expertAff3 = require('../assets/images/portfolio/project-expertaff1.png');
  const expertAff4 = require('../assets/images/portfolio/project-expertaff1.png');

  const openURL = url => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };
  // const openURL = async url => {
  //   const supported = await Linking.canOpenURL(url);
  //   if (supported) {
  //     await Linking.openURL(url);
  //   } else {
  //     console.log(`Cannot open URL: ${url}`);
  //   }
  // };
  const images = [expertAff1, expertAff2, expertAff3, expertAff4];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.portfolioInfo}>
          <Text style={styles.heading}>Project Information</Text>
          <View>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Project Title: </Text>ExpertAff
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Category: </Text>Web design
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Company: </Text>TrakAff-Affiliate
              Tracking Software
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Project Date: </Text>01 October,
              2023
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Tools & Technologies: </Text>
              Php, Laravel, Mysql, Ajax, Json, JavaScript, HTML, CSS, jQuery,
              Bootstrap
            </Text>
            <Text style={styles.infoItem}>
              <Text style={styles.infoTitle}>Project URL: </Text>
              <Text
                style={styles.link}
                onPress={() => openURL('https://www.expertaff.com')}>
                https://www.expertaff.com
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Expertaff Images</Text>
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.card}>
              <Image source={image} style={styles.image} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.description}>
        <Text style={styles.subHeading}>
          <Text style={styles.bold}>ExpertAff:</Text>
        </Text>
        <Text style={styles.paragraph}>
          ExpertAff is a platform designed for network listing, where users can
          create and manage affiliate networks. It allows users to create
          networks, leave reviews, and respond to them. The system includes
          features like login, signup, and forgot password functionality. The
          navbar contains various tabs:
        </Text>
        <Text style={styles.note}>
          <Text style={styles.noteBold}>Note: </Text>
          Admin can manage all front-end functionalities through the admin
          dashboard.
        </Text>

        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Add Network/Program: </Text>
            Allows users to create new networks.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Networks: </Text>
            View and manage all listed networks in one place.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Offers: </Text>
            Lists all available offers related to the networks.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Resources: </Text>
            Provides resources related to affiliate marketing.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Reviews: </Text>
            Allows users to give reviews on networks and reply to them.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Blog: </Text>
            Users can create and browse blogs related to affiliate marketing.
          </Text>
        </View>

        <Text style={styles.paragraph}>
          Additionally, the platform offers the ability to:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Rate Networks: </Text>
            Users can rate networks to give feedback on their performance and
            overall experience.
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.bold}>Sponsored Ads: </Text>
            The platform includes space for sponsored advertisements, allowing
            for promotional content display.
          </Text>
        </View>
        <Text style={styles.paragraph}>
          This project provides a comprehensive platform for managing and
          interacting with affiliate networks.
        </Text>
      </View>

      <View style={styles.socialLinks}>
        <Text style={styles.socialHeading}>Link</Text>
        <View style={styles.icons}>
          <TouchableOpacity
            onPress={() => openURL('https://wa.me/917488952139')}
            style={styles.iconButton}>
            <Icon name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL(
                'https://www.facebook.com/share/UbuEW2ucYCpR4MBK/?mibextid=qi2Omg',
              )
            }
            style={styles.iconButton}>
            <Icon name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openURL('#')}
            style={styles.iconButton}>
            <Icon name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL('https://github.com/Shahid-Raza7463?tab=repositories')
            }
            style={styles.iconButton}>
            <Icon name="github" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL('https://www.linkedin.com/in/mdshahidraza7886')
            }
            style={styles.iconButton}>
            <Icon name="linkedin" size={24} color="#0077B5" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.socialLinks}>
        <Text style={styles.socialHeading}>Link</Text>
        <View style={styles.icons}>
          <TouchableOpacity
            onPress={() => openURL('https://wa.me/917488952139')}
            style={styles.iconButton}>
            <Icon name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL(
                'https://www.facebook.com/share/UbuEW2ucYCpR4MBK/?mibextid=qi2Omg',
              )
            }
            style={styles.iconButton}>
            <Icon name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openURL('#')}
            style={styles.iconButton}>
            <Icon name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL('https://github.com/Shahid-Raza7463?tab=repositories')
            }
            style={styles.iconButton}>
            <Icon name="github" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              openURL('https://www.linkedin.com/in/mdshahidraza7886')
            }
            style={styles.iconButton}>
            <Icon name="linkedin" size={24} color="#0077B5" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  portfolioInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
  },
  link: {
    color: '#0040f0',
    textDecorationLine: 'underline',
  },
  description: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    fontSize: 14,
    lineHeight: 24,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 24,
  },
  note: {
    marginTop: 10,
    marginBottom: 10,
  },
  noteBold: {
    color: '#0040f0',
    fontWeight: 'bold',
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 24,
  },
  // image card
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 4,
    width: '48%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  // image card end hare
  // socal link
  socialLinks: {
    alignItems: 'center',
    marginTop: 16,
  },
  socialHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  iconButton: {
    marginHorizontal: 8,
  },
  // socal link end hare
});

export default ExpertaffDetailsScreen;
