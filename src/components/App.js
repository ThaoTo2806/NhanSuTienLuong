import 'react-native-gesture-handler';
import React, { useEffect, useReducer } from 'react';
import { YellowBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Login } from './login/login';
import { SplashScreen } from './splash-screen/splash-screen';
import { STORAGE_KEYS as KEYS } from '../assets/storage-keys';
import { AuthContext, LangContext, LANGS } from './common/contexts';
import { BaseAxios } from '../helpers/base-axios';
import { AppStack } from './app-stack/app-stack';

YellowBox.ignoreWarnings(['ReactNativeFiberHostComponent']);

const SplashStack = createStackNavigator();
const LoginStack = createStackNavigator();

const App = () => {
  const [state, dispatch] = useReducer(
    // reducer
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            isLoading: false,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_IN':
          return {
            isLoading: false,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            isLoading: false,
            isSignout: true,
            userToken: null,
          };
      }
    },
    // initial state
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    // Request thông tin nhân viên để check token
    const recheckToken = async () => {
      const json = await BaseAxios.get('/');
      return json.data.lv001 !== undefined;
    };

    // Lấy token từ AsyncStorage và check khả dụng
    const bootstrapAsync = async () => {
      const userName = await AsyncStorage.getItem(KEYS.USERNAME);
      const code = await AsyncStorage.getItem(KEYS.CODE);
      const token = await AsyncStorage.getItem(KEYS.TOKEN);

      if (userName && code && token) {
        try {
          const tokenStillValid = await recheckToken();

          if (tokenStillValid) {
            // token còn hiệu lực
            dispatch({ type: 'RESTORE_TOKEN', token });
          } else {
            // token hết hiệu lực
            dispatch({ type: 'SIGN_OUT' });
          }
        } catch {
          dispatch({ type: 'SIGN_OUT' });
        }
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: token => {
      dispatch({ type: 'SIGN_IN', token });
    },
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' });
    },
  };

  const langContext = {
    lang: LANGS[0].CODE,
    changeLang(newLang) {
      this.lang = newLang;
    },
  };

  let navigator;

  if (state.isLoading) {
    navigator = (
      <SplashStack.Navigator>
        <SplashStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      </SplashStack.Navigator>
    );
  } else if (state.isSignout) {
    navigator = (
      <LoginStack.Navigator>
        <LoginStack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      </LoginStack.Navigator>
    );
  } else {
    navigator = AppStack;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <LangContext.Provider value={langContext}>
        <NavigationContainer>{navigator}</NavigationContainer>
      </LangContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
