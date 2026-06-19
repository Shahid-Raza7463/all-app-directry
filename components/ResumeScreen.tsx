import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import Styles from './common/Styles';

const ResumeScreen = ({navigation}) => {
  return (
    <ScrollView style={Styles.container}>
      <View style={Styles.sectionTitle}>
        <Text style={Styles.heading}>Resume</Text>
        <Text style={Styles.paragraphresume}>
          Passionate and experienced Backend Web Developer with a solid
          foundation in full-stack development. Skilled in a variety of
          technologies, from PHP and Laravel to React and Node.js, I am driven
          to build innovative web solutions that meet and exceed client
          expectations. My journey in web development has been marked by a
          commitment to continuous learning and adapting to the latest industry
          trends. Below is a summary of my professional experience, education,
          skills, and certifications.
        </Text>
      </View>

      <View style={Styles.container}>
        {/* Objective */}
        <View style={Styles.resumeSection}>
          <Text style={Styles.resumeTitle}>Objective</Text>
          <Text style={Styles.paragraph}>
            Experienced Backend Web Developer with a passion for developing
            innovative web applications. Skilled in full-stack development,
            including front-end and back-end technologies. Seeking to use my
            skills and experience to contribute to a dynamic web development
            team.
          </Text>
        </View>

        {/* Education */}
        <View style={Styles.resumeSection}>
          <Text style={Styles.resumeTitle}>Education</Text>
          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>
              Master of Computer Applications (MCA)
            </Text>
            <Text style={Styles.date}>2023 - 2025</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                Chandigarh University, Punjab.
              </Text>{' '}
              Grade: 7.30 CGPA
            </Text>
          </View>

          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>
              Bachelor of Computer Applications (BCA)
            </Text>
            <Text style={Styles.date}>2019 - 2022</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                International School of Management, Patna
              </Text>
              , affiliated with Aryabhatta Knowledge University
            </Text>
            <Text style={Styles.text}>Grade: 7.48 CGPA</Text>
          </View>

          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>Intermediate in Science</Text>
            <Text style={Styles.date}>2017 - 2019</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                Saryu High School, Sursand, Sitamarhi
              </Text>
              , affiliated with Bihar School Examination Board
            </Text>
            <Text style={Styles.text}>Percentage: 71.8%</Text>
          </View>

          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>Matriculation (10th)</Text>
            <Text style={Styles.date}>2016 - 2017</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                Saryu High School, Sursand, Sitamarhi
              </Text>
              , affiliated with Bihar School Examination Board
            </Text>
            <Text style={Styles.text}>Percentage: 64.2%</Text>
          </View>
        </View>

        {/* Technical Skills */}
        <View style={Styles.resumeSection}>
          <Text style={Styles.resumeTitle}>Technical Skills</Text>
          <Text style={Styles.paragraph}>
            Programming Languages, Tools & Technologies, and Frameworks &
            Libraries: PHP, Laravel, MySQL, AJAX, JSON, JavaScript, React.js,
            Node.js, HTML, CSS, jQuery, Bootstrap, Git, and C Programming.
          </Text>
        </View>

        {/* Professional Experience */}
        <View style={Styles.resumeSection}>
          <Text style={Styles.resumeTitle}>Professional Experience</Text>
          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>Laravel Backend Web Developer</Text>
            <Text style={Styles.date}>29-09-2023 - Present</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                Capitall India Private Limited, New Delhi
              </Text>
            </Text>
            <Text style={Styles.paragraph}>
              - Developed the VSA Data Room.{'\n'}- Developed Balance
              Confirmation project.{'\n'}- Acquired basic knowledge in React.js,
              Node.js, and React Native.{'\n'}- Collaborated with clients to
              deliver successful projects based on their specifications.{'\n'}-
              Gained valuable experience in software testing.
            </Text>
          </View>

          <View style={Styles.resumeItem}>
            <Text style={Styles.subTitle}>
              Laravel Backend Web Developer Intern
            </Text>
            <Text style={Styles.date}>01-03-2023 - 26-09-2023</Text>
            <Text style={Styles.text}>
              <Text style={Styles.emphasis}>
                TrakAff - Affiliate Tracking Software, New Delhi
              </Text>
            </Text>
            <Text style={Styles.paragraph}>
              - Developed the Dynamic Expertaff web application projects.{'\n'}-
              Developed the Dynamic Linktester web application projects.{'\n'}-
              Gained expertise in PHP, Laravel, MySQL, AJAX, JSON, JavaScript.
            </Text>
          </View>
        </View>

        {/* Certifications & Training */}
        <View style={Styles.resumeSection}>
          <Text style={Styles.resumeTitle}>Certifications & Training</Text>
          <Text style={Styles.paragraph}>
            - Certificate of Appreciation for Frontend Web Development - Issued
            by DevTown, 2022.{'\n'}- Certificate of Completion in Frontend Web
            Development Bootcamp - Issued by DevTown, 2022.{'\n'}- Masterclass
            on JavaScript Bootcamp - Issued by Scaler Academy, 2022.{'\n'}-
            Certificate of Completion in PHP Language - Issued by Great
            Learning, 2023.
          </Text>
        </View>
      </View>
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

export default ResumeScreen;
