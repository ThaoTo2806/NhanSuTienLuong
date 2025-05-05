import React from 'react';
import { Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  DanhSachDonXinPhep as DaDuyet,
  DanhSachDonXinPhep as DoiDuyet,
  DanhSachDonXinPhep as KhongDuyet,
} from '../danhsach-don-xinphep/danhsach-don-xinphep';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE, PADDING } = SPACINGS;
const Tab = createMaterialBottomTabNavigator();

export const TabsDonXinPhep = () => {
  return (
    <Tab.Navigator
      activeColor={COLORS.LIGHT}
      backBehavior="none"
      barStyle={{
        backgroundColor: COLORS.PRIMARY,
        paddingBottom: PADDING,
      }}
      inactiveColor={COLORS.DIM}
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'DaDuyet':
              iconName = focused ? 'bag-check' : 'bag-check-outline';
              break;
            case 'DoiDuyet':
              iconName = focused ? 'time-sharp' : 'time-outline';
              break;
            case 'KhongDuyet':
              iconName = focused ? 'stop-circle' : 'stop-circle-outline';
              break;
          }

          return <Icon name={iconName} size={FONT_SIZE * 1.2} color={color} />;
        },
      })}>
      <Tab.Screen
        name="DaDuyet"
        component={DaDuyet}
        options={{
          tabBarLabel: <Text style={{ fontSize: FONT_SIZE }}>Đã duyệt</Text>,
        }}
      />
      <Tab.Screen
        name="DoiDuyet"
        component={DoiDuyet}
        options={{
          tabBarLabel: <Text style={{ fontSize: FONT_SIZE }}>Đợi duyệt</Text>,
        }}
      />
      <Tab.Screen
        name="KhongDuyet"
        component={KhongDuyet}
        options={{
          tabBarLabel: <Text style={{ fontSize: FONT_SIZE }}>Không duyệt</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
