import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  // Main container
  contentcenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  // profile image
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  // Headings
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  // Button group
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  // Button styles
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  //* About page
  // Paragraph text
  paragraph: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  //* About page end
  //* resume page
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    marginVertical: 16,
  },

  paragraphresume: {
    fontSize: 16,
    color: '#555',
    textAlign: 'justify',
    lineHeight: 22,
  },
  resumeSection: {
    marginVertical: 16,
  },
  resumeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  resumeItem: {
    marginBottom: 16,
  },
  // Resume Item Details
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  date: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  emphasis: {
    fontStyle: 'italic',
  },
  //* resume page end
  //* contact page
  headingcontact: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
    textAlign: 'center',
  },
  infoWrap: {
    marginVertical: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  form: {
    marginTop: 16,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingLeft: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textarea: {
    height: 120,
  },
  buttoncontact: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonTextcontact: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapEmbed: {
    marginTop: 32,
  },
  map: {
    width: '100%',
    height: 270,
    borderWidth: 0,
    borderRadius: 8,
  },

  // map
  // containermap: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 10,
  // },
  // mapstyle: {
  //   width: '100%',
  //   height: 300, // Adjust this value based on your design
  // },

  // portfolio page
  containerp: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  headingp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraphp: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardp: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
  },
  projectTitlep: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  imagep: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  buttonp: {
    backgroundColor: '#6200ea',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
  },
  buttonTextp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
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
  setPosition: {
    position: 'absolute',
  },
  // socal link end hare
});

export default styles;
