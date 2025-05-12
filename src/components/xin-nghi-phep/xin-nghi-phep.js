import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; 
import dayjs from 'dayjs';
import { SofDateTimePicker } from '../common/sof-date-time-picker/sof-date-time-picker';
import { StyledPicker } from '../common/styled-picker/styled-picker';
import { COLORS } from '../../assets/colors';
import { commonStyles } from '../../assets/common-styles';
import { MESSAGES } from '../../assets/messages';
import { SPACINGS } from '../../assets/spacings';
import { STORAGE_KEYS as KEYS } from '../../assets/storage-keys';
import { LangContext } from '../common/contexts';
import { styles } from './style';
import { BaseAxios } from '../../helpers/base-axios';

const { FONT_SIZE, MARGIN } = SPACINGS;

export const XinNghiPhep = ({ navigation }) => {
  const { lang } = useContext(LangContext);
  const [loaiDon, setLoaiDon] = useState(null);
  const [hinhThucNghi, setHinhThucNghi] = useState(null);
  const [caLamViec, setCaLamViec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tuNgayGio, setTuNgayGio] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      7,
      30,
    ),
  );
  const [denNgayGio, setDenNgayGio] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      16,
      30,
    ),
  );
  const [danhSachLoaiDon, setDanhSachLoaiDon] = useState([]);
  const [danhSachHinhThucNghi, setDanhSachHinhThucNghi] = useState([]);
  const [danhSachCaLamViec, setDanhSachCaLamViec] = useState([]);
  const [lyDoNghi, setLyDoNghi] = useState('');
  const [saving, setSaving] = useState(false);
  const mounted = useRef(true);

  const _alert = (message, action) => {
    Alert.alert(
      '',
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            action && action();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const _taoDonXinPhep = useCallback(() => {
    (async () => {
      if (mounted.current) {

        if (!loaiDon) {
          _alert(MESSAGES[lang].CHUA_CHON_LOAI_DON);
        } else if (!caLamViec) {
          _alert(MESSAGES[lang].CHUA_CHON_CA);
        } else if (tuNgayGio.getTime() > denNgayGio.getTime()) {
          _alert(MESSAGES[lang].KHOANG_THOI_GIAN_KHONG_DUNG);
        } else if (lyDoNghi.trim() === '') {
          _alert(MESSAGES[lang].CHUA_CO_MO_TA);
        } else {
          setSaving(true);

          const code = await AsyncStorage.getItem(KEYS.CODE);
          const query = {
            table: 'jo_lv0004',
            func: 'add',
            lv002: caLamViec,
            lv003: loaiDon,
            lv008: lyDoNghi,
            lv015: code,
            lv016: dayjs(tuNgayGio).format('YYYY-MM-DD HH:mm:ss'),
            lv017: dayjs(denNgayGio).format('YYYY-MM-DD HH:mm:ss'),
            lv022: hinhThucNghi,
          };

          try {
            const json = await BaseAxios.post('/', null, { query });
            if (mounted.current) {
              setSaving(false);
              if (Array.isArray(json.data) && json.data.length === 0) { //json.data.successfull
                _alert(MESSAGES[lang].TAO_DON_XIN_PHEP_THANH_CONG, () => {
                  navigation.goBack();
                });
              } else {
                _alert(json.data.message.replace(/<br\s*\/>/, ''));
              }
            }
          } catch (error) {
            if (mounted.current) {
              setSaving(false);
              _alert(error.message);
            }
          }
        }
      }
    })();
  }, [
    loaiDon,
    caLamViec,
    tuNgayGio,
    denNgayGio,
    lyDoNghi,
    lang,
    hinhThucNghi,
    navigation,
  ]);

  useEffect(() => {
    if (saving) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerRightWrapper}>
            <ActivityIndicator color={COLORS.PRIMARY} />
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerRightWrapper}>
            <Icon.Button
              name="save"
              backgroundColor={COLORS.PRIMARY}
              onPress={() => {
                _taoDonXinPhep();
              }}
              size={FONT_SIZE}
              iconStyle={{ marginLeft: MARGIN }}
              color={COLORS.LIGHT}>
              <Text
                style={{
                  color: COLORS.LIGHT,
                  fontSize: FONT_SIZE,
                  marginRight: MARGIN,
                }}>
                Lưu
              </Text>
            </Icon.Button>
          </View>
        ),
      });
    }
  }, [navigation, saving, _taoDonXinPhep]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const getDanhMuc = async () => {
      if (mounted.current) {
        try {
          const getDMLoaiDon = BaseAxios.get('/', {
            query: {
              table: 'tc_lv0002',
              func: 'data',
            },
          });
          const getDMHinhThucNghi = BaseAxios.get('/', {
            query: {
              table: 'jo_lv0100',
              func: 'data',
            },
          });
          const getDMCaLamViec = BaseAxios.get('/', {
            query: {
              table: 'tc_lv0004',
              func: 'data',
            },
          });

          const jsons = await Promise.all([
            getDMLoaiDon,
            getDMHinhThucNghi,
            getDMCaLamViec,
          ]);

          if (mounted.current) {
            setLoading(false);
            setLoaiDon(jsons[0].data[0].lv001);
            setHinhThucNghi(jsons[1].data[0].lv001);
            setCaLamViec(jsons[2].data[0].lv001);
            setDanhSachLoaiDon(
              jsons[0].data.map(ld => ({
                text: ld.lv003,
                value: ld.lv001,
              })),
            );
            setDanhSachHinhThucNghi(
              jsons[1].data.map(htn => ({
                text: htn.lv002,
                value: htn.lv001,
              })),
            );
            setDanhSachCaLamViec(
              jsons[2].data.map(clv => ({
                text: clv.lv002,
                value: clv.lv001,
              })),
            );
          }
        } catch {
          if (mounted.current) {
            setLoading(false);
            _alert(MESSAGES[lang].GET_CATEGORY_FAIL);
          }
        }
      }
    };

    getDanhMuc();
  }, [lang]);

  const _startDateTimeChanged = newDateTime => {
    if (newDateTime && mounted.current) {
      setTuNgayGio(newDateTime);

      // tránh tình trạng từ ngày giờ > đến ngày giờ
      if (newDateTime.getTime() > denNgayGio.getTime()) {
        setDenNgayGio(newDateTime);
      }
    }
  };

  const _endDateTimeChanged = newDateTime => {
    if (newDateTime && mounted.current) {
      setDenNgayGio(newDateTime);

      // tránh tình trạng từ ngày giờ > đến ngày giờ
      if (newDateTime.getTime() < tuNgayGio.getTime()) {
        setTuNgayGio(newDateTime);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      {!loading && (
        <>
          <ScrollView>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Loại đơn</Text>
              <StyledPicker
                enable={danhSachLoaiDon.length > 0}
                items={danhSachLoaiDon}
                onValueChange={value => {
                  if (mounted.current) {
                    setLoaiDon(value);
                  }
                }}
                textField="text"
                valueField="value"
                fontSize={FONT_SIZE}
              />
            </View>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Hình thức nghỉ</Text>
              <StyledPicker
                enable={danhSachHinhThucNghi.length > 0}
                items={danhSachHinhThucNghi}
                onValueChange={value => {
                  if (mounted.current) {
                    setHinhThucNghi(value);
                  }
                }}
                textField="text"
                valueField="value"
                fontSize={FONT_SIZE}
              />
            </View>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Ca làm việc</Text>
              <StyledPicker
                enable={danhSachCaLamViec.length > 0}
                items={danhSachCaLamViec}
                onValueChange={value => {
                  if (mounted.current) {
                    setCaLamViec(value);
                  }
                }}
                textField="text"
                valueField="value"
                fontSize={FONT_SIZE}
              />
            </View>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Ngày bắt đầu nghỉ</Text>
              <SofDateTimePicker
                color={COLORS.DARK}
                fontSize={FONT_SIZE}
                onChange={_startDateTimeChanged}
                initialValue={tuNgayGio}
                key={tuNgayGio.getTime()}
              />
            </View>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Đến ngày</Text>
              <SofDateTimePicker
                color={COLORS.DARK}
                fontSize={FONT_SIZE}
                onChange={_endDateTimeChanged}
                initialValue={denNgayGio}
                key={denNgayGio.getTime()}
              />
            </View>
            <View style={commonStyles.formGroup}>
              <Text style={commonStyles.label}>Lý do nghỉ</Text>
              <TextInput
                multiline={true}
                onChangeText={text => {
                  if (mounted.current) {
                    setLyDoNghi(text);
                  }
                }}
                style={styles.content}
              />
            </View>
          </ScrollView>
        </>
      )}
      {loading && <ActivityIndicator size="large" color={COLORS.PRIMARY} />}
    </View>
  );
};
