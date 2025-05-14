import React, {useContext, useState, useEffect} from 'react';
import {Image, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../../assets/colors';
import {SPACINGS} from '../../assets/spacings';
import {STORAGE_KEYS as KEYS} from '../../assets/storage-keys';
import {styles} from './style';
import {AuthContext} from '../common/contexts';
import {API_URLS} from '../../assets/api-urls';
import ModalCustom from '../ModalCustom';
import {modalStyles} from './modalStyles';
import {loadData} from '../../services/thongbao';

const {FONT_SIZE} = SPACINGS;
const {GRADIENT} = COLORS;

export const Menu = ({navigation}) => {
  const [permission, setPermission] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [token, setToken] = useState(null);
  const {signOut} = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const storedPermission = await AsyncStorage.getItem(KEYS.PERMISSION);
      const storedToken = await AsyncStorage.getItem(KEYS.TOKEN);
      if (mounted) {
        setPermission(JSON.parse(storedPermission));
        setToken(storedToken);
        setModalVisible(true); // 👉 show modal here

        const res = await loadData(storedToken, '0221', 'select');
        if (res.success && Array.isArray(res.data)) {
          // Sort by lv003 ASC
          const sorted = res.data.sort(
            (a, b) => parseInt(a.lv003) - parseInt(b.lv003),
          );
          setDataList(sorted);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const _logOut = async () => {
    // Xóa thông tin đăng nhập khỏi AsyncStorage
    await AsyncStorage.removeItem(KEYS.USERNAME);
    await AsyncStorage.removeItem(KEYS.CODE);
    await AsyncStorage.removeItem(KEYS.TOKEN);

    // Gửi yêu cầu logout đến server
    try {
      const token = await AsyncStorage.getItem(KEYS.TOKEN);
      if (token) {
        await fetch(API_URLS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token,
          }),
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    signOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[GRADIENT.FIRST, GRADIENT.SECOND]}
        style={styles.gradient}
      />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <View style={styles.logo}>
          <Image
            source={require('../../assets/images/sof.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="calendar-number-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('XinNghiPhep');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Xin nghỉ phép</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="list-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('TabsDonXinPhep');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Danh sách đơn xin phép</Text>
          </Icon.Button>
        </View>
        {(permission?.Jo0008?.View ||
          permission?.Jo0009?.View ||
          permission?.Jo0010?.View) && (
          <View style={styles.button}>
            <Icon.Button
              name="bag-check-outline"
              backgroundColor={COLORS.PRIMARY}
              onPress={() => {
                navigation.navigate('TabsDuyetPhepCap1');
              }}
              size={FONT_SIZE}
              iconStyle={styles.icon}>
              <Text style={styles.text}>Duyệt phép cấp 1</Text>
            </Icon.Button>
          </View>
        )}
        {(permission?.Jo0012?.View ||
          permission?.Jo0013?.View ||
          permission?.Jo0014?.View) && (
          <View style={styles.button}>
            <Icon.Button
              name="bag-check-outline"
              backgroundColor={COLORS.PRIMARY}
              onPress={() => {
                navigation.navigate('TabsDuyetPhepCap2');
              }}
              size={FONT_SIZE}
              iconStyle={styles.icon}>
              <Text style={styles.text}>Duyệt phép cấp 2</Text>
            </Icon.Button>
          </View>
        )}
        {(permission?.Jo0022?.View ||
          permission?.Jo0023?.View ||
          permission?.Jo0024?.View) && (
          <View style={styles.button}>
            <Icon.Button
              name="bag-check-outline"
              backgroundColor={COLORS.PRIMARY}
              onPress={() => {
                navigation.navigate('TabsDuyetPhepCap3');
              }}
              size={FONT_SIZE}
              iconStyle={styles.icon}>
              <Text style={styles.text}>Duyệt phép cấp 3</Text>
            </Icon.Button>
          </View>
        )}
        <View style={styles.button}>
          <Icon.Button
            name="cash-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('XemLuong');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Xem bảng lương</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="calendar-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('XemCa');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Xem ca làm việc</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="storefront-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('DangKyCom');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Đăng ký cơm</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="library-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('BaoCaoCong');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Báo cáo công</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="person-circle-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              navigation.navigate('ThongTinNhanVien');
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Thông tin cá nhân</Text>
          </Icon.Button>
        </View>
        <View style={styles.button}>
          <Icon.Button
            name="log-out-outline"
            backgroundColor={COLORS.PRIMARY}
            onPress={() => {
              (async () => {
                await _logOut();
              })();
            }}
            size={FONT_SIZE}
            iconStyle={styles.icon}>
            <Text style={styles.text}>Đăng xuất</Text>
          </Icon.Button>
        </View>
      </ScrollView>
      {/* 👉 Modal holiday message */}
      <ModalCustom isVisible={isModalVisible} onBackdropPress={closeModal}>
        {dataList.length > 0 && (
          <View style={modalStyles.modalContent}>
            <Image
              source={{uri: dataList[0].image}} // ảnh từ API (URL)
              style={modalStyles.image}
              resizeMode="contain"
            />
            <Text style={modalStyles.title}>Thông báo</Text>
            <Text style={modalStyles.message}>{dataList[0].lv002}</Text>
          </View>
        )}
      </ModalCustom>
    </View>
  );
};
