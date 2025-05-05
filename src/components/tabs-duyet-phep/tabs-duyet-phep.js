import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  DuyetPhep as DaDuyet,
  DuyetPhep as DoiDuyet,
  DuyetPhep as KhongDuyet,
} from '../duyet-phep/duyet-phep';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';
import { STORAGE_KEYS as KEYS } from '../../assets/storage-keys';

const { FONT_SIZE, PADDING } = SPACINGS;
const Tab = createMaterialBottomTabNavigator();

// eslint-disable-next-line react/prop-types
export const TabsDuyetPhep = ({ route: parentRoute }) => {
  const [permission, setPermission] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const storedPermission = await AsyncStorage.getItem(KEYS.PERMISSION);

      if (mounted.current) {
        setPermission(JSON.parse(storedPermission));
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <>
      {!permission && <ActivityIndicator size="large" color={COLORS.PRIMARY} />}
      {permission && (
        <Tab.Navigator
          activeColor={COLORS.LIGHT}
          backBehavior="none"
          barStyle={{
            backgroundColor: COLORS.PRIMARY,
            paddingBottom: PADDING,
          }}
          inactiveColor={COLORS.DIM}
          screenOptions={({ route }) => {
            return {
              // eslint-disable-next-line react/prop-types
              tabBarIcon: ({ focused, color }) => {
                let { name: routeName } = route;
                let iconName;

                routeName = routeName.substr(0, routeName.length - 4);

                switch (routeName) {
                  case 'DoiDuyet':
                    iconName = focused ? 'hourglass' : 'hourglass-o';
                    break;
                  case 'DaDuyet':
                    iconName = focused ? 'check-square' : 'check-square-o';
                    break;
                  case 'KhongDuyet':
                    iconName = focused ? 'times-circle' : 'times-circle-o';
                    break;
                }

                return (
                  <Icon name={iconName} size={FONT_SIZE * 1.2} color={color} />
                );
              },
            };
          }}>
          {(permission?.Jo0008?.View ||
            permission?.Jo0012?.View ||
            permission?.Jo0022?.View) && (
            <Tab.Screen
              name={`DoiDuyetCap${parentRoute.name.substr(-1)}`}
              component={DoiDuyet}
              options={{
                tabBarLabel: (
                  <Text style={{ fontSize: FONT_SIZE }}>Đợi duyệt</Text>
                ),
              }}
            />
          )}
          {(permission?.Jo0009?.View ||
            permission?.Jo0013?.View ||
            permission?.Jo0023?.View) && (
            <Tab.Screen
              name={`DaDuyetCap${parentRoute.name.substr(-1)}`}
              component={DaDuyet}
              options={{
                tabBarLabel: (
                  <Text style={{ fontSize: FONT_SIZE }}>Đã duyệt</Text>
                ),
              }}
            />
          )}
          {(permission?.Jo0010?.View ||
            permission?.Jo0014?.View ||
            permission?.Jo0024?.View) && (
            <Tab.Screen
              name={`KhongDuyetCap${parentRoute.name.substr(-1)}`}
              component={KhongDuyet}
              options={{
                tabBarLabel: (
                  <Text style={{ fontSize: FONT_SIZE }}>Không duyệt</Text>
                ),
              }}
            />
          )}
        </Tab.Navigator>
      )}
    </>
  );
};
