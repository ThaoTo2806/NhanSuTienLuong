import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressBar from 'react-native-progress/Bar';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { AppConfig } from '../AppConfig';

const {
  colors,
  gradient,
  fontSize,
  margin,
  MESSAGES,
  storageKeys: k,
  urls,
} = AppConfig;
const steps = 1;

export class Start extends React.Component {
  state = {
    error: false,
    progress: 0,
  };

  _isMounted = false;

  _bootstrapAsync = async () => {
    const userName = await AsyncStorage.getItem(k.userName);
    const code = await AsyncStorage.getItem(k.code);
    const token = await AsyncStorage.getItem(k.token);

    if (userName && code && token) {
      try {
        const tokenStillValid = await this._recheckToken(userName, code, token);

        if (tokenStillValid) {
          this.props.navigation.navigate('Menu', {
            userName,
            code,
            token,
          });
        } else {
          (async () => {
            await this._navigateToLogin();
          })();
        }
      } catch {
        if (this._isMounted) {
          this.setState({ error: true });
        }
      }
    } else {
      (async () => {
        await this._navigateToLogin();
      })();
    }
  };

  _recheckToken = async (userName, code, token) => {
    const serviceURL = await AsyncStorage.getItem('@SOF:serviceURL');
    const url = serviceURL ? serviceURL : urls.services;
    const response = await fetch(
      `${url}?ID=${userName}&code=${code}&token=${token}`,
    );
    const json = await response.json();

    return !json.message;
  };

  _navigateToLogin = async () => {
    await AsyncStorage.removeItem(k.userName);
    await AsyncStorage.removeItem(k.code);
    await AsyncStorage.removeItem(k.token);

    this.props.navigation.navigate('Login');
  };

  _progress = () => {
    if (this.state.progress === steps) {
      (async () => {
        await this._bootstrapAsync();
      })();
    } else {
      if (this._isMounted) {
        this.setState(
          state => {
            return {
              progress: state.progress + 1,
            };
          },
          () => {
            setTimeout(this._progress, 100);
          },
        );
      }
    }
  };

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrapper}>
          <LinearGradient
            colors={[gradient.first, gradient.second]}
            style={styles.gradient}
          />
          <View style={styles.container}>
            <Image
              resizeMode="contain"
              source={require('../images/logo.png')}
            />
            <Text style={styles.message}>{MESSAGES.NETWORK_ERROR}</Text>
            <Icon.Button
              name="refresh"
              backgroundColor={colors.primary}
              onPress={() => {
                this.setState({ error: false }, () => {
                  (async () => {
                    await this._bootstrapAsync();
                  })();
                });
              }}
              size={fontSize}
              iconStyle={styles.icon}>
              <Text style={styles.buttonText}>Thử lại</Text>
            </Icon.Button>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.wrapper}>
          <LinearGradient
            colors={[gradient.first, gradient.second]}
            style={styles.gradient}
          />
          <View style={styles.container}>
            <Image
              resizeMode="contain"
              source={require('../images/logo.png')}
            />
            <ProgressBar
              color={colors.primary}
              height={fontSize}
              indeterminate={true}
              useNativeDriver={true}
              width={200}
            />
            {/* <Icon.Button
              name="cogs"
              backgroundColor={colors.primary}
              onPress={() => {
                this.props.navigation.navigate('Settings');
              }}
              size={fontSize}
              iconStyle={styles.icon}>
              <Text style={styles.buttonText}>Thiết lập</Text>
            </Icon.Button> */}
          </View>
        </View>
      );
    }
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(this._progress, 100);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 30,
  },
  // icon: {
  //   margin,
  // },
  buttonText: {
    color: '#fff',
    fontSize,
    fontWeight: '500',
    marginRight: margin,
  },
  wrapper: {
    flex: 1,
  },
  gradient: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  message: {
    color: colors.dark,
    fontSize,
  },
});
