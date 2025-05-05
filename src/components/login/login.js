import React, { useContext, useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
import LinearGradient from 'react-native-linear-gradient';
import { TextInputWithIcon } from '../common/text-input-with-icon/text-input-with-icon';
import { SPACINGS } from '../../assets/spacings';
import { COLORS } from '../../assets/colors';
import { MESSAGES } from '../../assets/messages';
import { STORAGE_KEYS as KEYS } from '../../assets/storage-keys';
import { API_URLS } from '../../assets/api-urls';
import { AuthContext, LangContext } from '../common/contexts';
import { styles } from './style';

const { FONT_SIZE } = SPACINGS;
const { GRADIENT } = COLORS;

export const Login = () => {
  const { signIn } = useContext(AuthContext);
  const { lang } = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notifyText, setNotifyText] = useState(null);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const refPassword = useRef();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const login_ = async () => {
    if (!userName || !password) {
      if (mounted.current) {
        setError(true);
        setNotifyText(MESSAGES[lang].LOGIN_EMPTY);
      }
      return;
    }
  
    if (mounted.current) {
      setLoading(true);
    }
  
    try {
      // Đổi sang phương thức GET
      const url = `${API_URLS.LOGIN}?txtUserName=${encodeURIComponent(userName)}&txtPassword=${encodeURIComponent(password)}`;
      const response = await fetch(url, {
        method: 'GET',
      });
  
      // Kiểm tra xem response có thành công không
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
  
      const json = await response.json();
      console.log("API Response:", json);
  
      if (json.code && json.token) {
        if (mounted.current) {
          setLoading(false);
        }
  
        await AsyncStorage.setItem(KEYS.USERNAME, userName);
        await AsyncStorage.setItem(KEYS.CODE, json.code);
        await AsyncStorage.setItem(KEYS.TOKEN, json.token);
  
        signIn(json.token);
      } else {
        throw new Error(MESSAGES[lang].LOGIN_FAIL);
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (mounted.current) {
        setLoading(false);
        setError(true);
        setNotifyText(`${MESSAGES[lang].LOGIN_FAIL}: ${error.message}`);
      }
    }
  };

  /*const login_ = async () => {
    if (!(userName && password)) {
      if (mounted.current) {
        setError(true);
        setNotifyText(MESSAGES[lang].LOGIN_EMPTY);
      }
    } else {
      if (mounted.current) {
        setLoading(true);
      }

      try {
        const response = await fetch(API_URLS.LOGIN, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `txtUserName=${userName}&txtPassword=${password}`,
        });

        const json = await response.json();
        console.log("API Response:", json);

        if (json.code && json.token) {
          if (mounted.current) {
            setLoading(false);
          }

          await AsyncStorage.setItem(KEYS.USERNAME, userName);
          await AsyncStorage.setItem(KEYS.CODE, json.code);
          await AsyncStorage.setItem(KEYS.TOKEN, json.token);

          signIn(json.token);
        } else {
          throw new Error(MESSAGES[lang].LOGIN_FAIL);
        }
      } catch (error) {
        console.error("Login Error:", error);
        if (mounted.current) {
          setLoading(false);
          setError(true);
          setNotifyText(`${MESSAGES[lang].LOGIN_FAIL}: ${error.message}`);
        }
      }
    }
  };*/

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[GRADIENT.FIRST, GRADIENT.SECOND]}
        style={styles.gradient}
      />
      <ScrollView contentContainerStyle={[styles.innerWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[styles.container, { alignItems: 'center' }]}>
          <Image
            source={require('../../assets/images/sof.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.textBox}>
          <TextInputWithIcon
            autoFocus={true}
            backgroundColor="#eaf4fe"
            color={COLORS.DARK}
            fontSize={FONT_SIZE}
            icon="person-circle" 
            onChangeText={text => {
              if (mounted.current) {
                setUserName(text);
              }
            }}
            onFocus={() => {
              if (mounted.current) {
                setError(false);
              }
            }}
            onSubmitEditing={() => refPassword.current.focus()}
            placeholder="Tài khoản đăng nhập"
          />
        </View>
        <View style={styles.textBox}>
          <TextInputWithIcon
            backgroundColor="#eaf4fe"
            color={COLORS.DARK}
            fontSize={FONT_SIZE}
            icon="key" 
            onChangeText={text => {
              if (mounted.current) {
                setPassword(text);
              }
            }}
            onFocus={() => {
              if (mounted.current) {
                setError(false);
              }
            }}
            onSubmitEditing={() => {
              (async () => {
                await login_();
              })();
            }}
            myref={refPassword}
            placeholder="Mật khẩu"
            returnKeyType="done"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Icon.Button
            name="log-in-outline"
            backgroundColor={COLORS.LOGIN_BUTTON_BACKGROUND_COLOR}
            borderRadius={30}
            onPress={() => {
              (async () => {
                await login_();
              })();
            }}
            size={FONT_SIZE}
            iconStyle={styles.buttonIcon}
            color={COLORS.LIGHT}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Icon.Button>
        </View>
        {loading ? (
          <View style={styles.marginTop}>
            <ActivityIndicator animating={true} size="large" color="#207dc5" />
          </View>
        ) : null}
        {error ? (
          <View style={styles.marginTop}>
            <Text style={styles.notifyText}>{notifyText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

//--legacy-peer-deps
