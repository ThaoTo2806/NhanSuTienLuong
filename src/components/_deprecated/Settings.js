import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from '../../assets/commonStyles.js';
import { apiUrl as urls } from '../../assets/api_urls';
import { COLORS } from '../../assets/colors';
import { spacings } from '../../assets/spacings';
import { storageKeys as keys } from '../../assets/storage_keys';

const { fontSize, margin } = spacings;

export class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginURL: '',
      serviceURL: '',
    };

    this._isMounted = false;
  }

  _getSettings = async () => {
    const loginURL = await AsyncStorage.getItem('@SOF:loginURL');
    const serviceURL = await AsyncStorage.getItem('@SOF:serviceURL');

    if (loginURL && serviceURL) {
      if (this._isMounted) {
        this.setState({ loginURL, serviceURL });
      }
    } else {
      if (this._isMounted) {
        this.setState({
          loginURL: urls.login,
          serviceURL: urls.services,
        });
      }
    }
  };

  _saveSettings = async () => {
    await AsyncStorage.setItem('@SOF:loginURL', this.state.loginURL);
    await AsyncStorage.setItem('@SOF:serviceURL', this.state.serviceURL);

    this.props.navigation.navigate('Start');
  };

  componentDidMount() {
    this._isMounted = true;
    this._getSettings();
  }

  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.wrapper}>
        <View style={[commonStyles.formGroup, styles.textWrapper]}>
          <Text style={commonStyles.label}>URL ĐĂNG NHẬP</Text>
          <TextInput
            autoCorrect={false}
            onChangeText={text => {
              if (this._isMounted) {
                this.setState({ loginURL: text });
              }
            }}
            style={[commonStyles.content, styles.url]}
            value={this.state.loginURL}
          />
        </View>
        <View style={[commonStyles.formGroup, styles.textWrapper]}>
          <Text style={commonStyles.label}>URL LẤY THÔNG TIN</Text>
          <TextInput
            autoCorrect={false}
            onChangeText={text => {
              if (this._isMounted) {
                this.setState({ serviceURL: text });
              }
            }}
            style={[commonStyles.content, styles.url]}
            value={this.state.serviceURL}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <View style={styles.button}>
            <Icon.Button
              name="remove"
              backgroundColor="#babcb8"
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}
              size={fontSize}
              iconStyle={styles.icon}>
              <Text style={styles.text}>Cancel</Text>
            </Icon.Button>
          </View>
          <View style={styles.button}>
            <Icon.Button
              name="floppy-o"
              backgroundColor={COLORS.PRIMARY}
              onPress={() => {
                (async () => {
                  await this._saveSettings();
                })();
              }}
              size={fontSize}
              iconStyle={styles.icon}>
              <Text style={styles.text}>Save</Text>
            </Icon.Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: margin,
  },
  button: {
    marginHorizontal: margin,
  },
  icon: {
    margin,
  },
  text: {
    color: '#fff',
    fontSize,
    fontWeight: '500',
    marginRight: margin,
  },
  wrapper: {
    alignItems: 'center',
    height: '100%',
    margin: margin * 2,
  },
  url: {
    textDecorationLine: 'underline',
  },
  textWrapper: {
    width: '100%',
  },
});
