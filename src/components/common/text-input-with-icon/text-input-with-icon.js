import React from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import PropTypes from 'prop-types';
import { styles } from './style';

const TextInputWithIcon = props => {
  const {
    icon,
    autoFocus,
    onChangeText,
    onFocus,
    onSubmitEditing,
    placeholder,
    myref,
    returnKeyType,
    secureTextEntry,
    backgroundColor,
    color,
    fontSize,
  } = props;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Icon name={icon} color={color} style={styles.icon} size={fontSize} />
      <TextInput
        autoCorrect={false}
        autoFocus={autoFocus}
        blurOnSubmit={false}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        ref={myref}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectTextOnFocus={true}
        style={[styles.text, { color, fontSize }]}
      />
    </View>
  );
};

TextInputWithIcon.propTypes = {
  autoFocus: PropTypes.bool,
  onChangeText: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  placeholder: PropTypes.string,
  myref: PropTypes.any,
  returnKeyType: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

TextInputWithIcon.defaultProps = {
  autoFocus: false,
  backgroundColor: '#eee',
  color: '#444',
  fontSize: 16,
  placeholder: '',
  returnKeyType: 'next',
  secureTextEntry: false,
};

export { TextInputWithIcon };
