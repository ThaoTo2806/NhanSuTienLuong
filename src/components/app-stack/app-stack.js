import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Menu} from '../menu/menu';
import {ThongTinNhanVien} from '../thongtin-nhanvien/thongtin-nhanvien';
import {XemLuong} from '../xem-luong/xem-luong';
import {XemCa} from '../xem-ca/xem-ca';
import {XinNghiPhep} from '../xin-nghi-phep/xin-nghi-phep';
import {TabsDonXinPhep} from '../tabs-don-xin-phep/tabs-don-xin-phep';
import {
  TabsDuyetPhep as TabsDuyetPhepCap1,
  TabsDuyetPhep as TabsDuyetPhepCap2,
  TabsDuyetPhep as TabsDuyetPhepCap3,
} from '../tabs-duyet-phep/tabs-duyet-phep';
import {SPACINGS} from '../../assets/spacings';
import {DangKyCom} from '../dang-ky-com/DangKyCom';
import {BaoCaoCong} from '../bao-cao-cong/BaoCaoCong';

const {FONT_SIZE} = SPACINGS;
const fontSize = FONT_SIZE * 1.2;
const Stack = createStackNavigator();

export const AppStack = (
  <Stack.Navigator initialRouteName="Menu">
    <Stack.Screen
      name="Menu"
      component={Menu}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="XinNghiPhep"
      component={XinNghiPhep}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Xin nghỉ phép',
      }}
    />
    <Stack.Screen
      name="TabsDonXinPhep"
      component={TabsDonXinPhep}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Đơn xin phép',
      }}
    />
    <Stack.Screen
      name="TabsDuyetPhepCap1"
      component={TabsDuyetPhepCap1}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Duyệt phép cấp 1',
      }}
    />
    <Stack.Screen
      name="TabsDuyetPhepCap2"
      component={TabsDuyetPhepCap2}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Duyệt phép cấp 2',
      }}
    />
    <Stack.Screen
      name="TabsDuyetPhepCap3"
      component={TabsDuyetPhepCap3}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Duyệt phép cấp 3',
      }}
    />
    <Stack.Screen
      name="XemLuong"
      component={XemLuong}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Lương tháng',
      }}
    />
    <Stack.Screen
      name="XemCa"
      component={XemCa}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Ca làm việc',
      }}
    />
    <Stack.Screen
      name="ThongTinNhanVien"
      component={ThongTinNhanVien}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Thông tin cá nhân',
      }}
    />
    <Stack.Screen
      name="BaoCaoCong"
      component={BaoCaoCong}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Báo cáo công',
      }}
    />
    <Stack.Screen
      name="DangKyCom"
      component={DangKyCom}
      options={{
        headerTitleStyle: {fontSize},
        title: 'Đăng ký cơm',
      }}
    />
  </Stack.Navigator>
);
