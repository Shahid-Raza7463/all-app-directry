module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-private-property-in-object',
    'react-native-reanimated/plugin',
  ],
};

// module.exports = {
//   presets: ['module:@react-native/babel-preset'],
// };

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     'react-native-reanimated/plugin',
//     '@babel/plugin-transform-class-properties',
//     '@babel/plugin-transform-private-methods',
//     '@babel/plugin-transform-private-property-in-object',
//   ],
// };



