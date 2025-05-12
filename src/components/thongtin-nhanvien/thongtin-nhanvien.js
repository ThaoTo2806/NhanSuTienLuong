import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonStyles } from '../../assets/common-styles';
import { COLORS } from '../../assets/colors';
import { MESSAGES } from '../../assets/messages';
import { SPACINGS } from '../../assets/spacings';
import { LangContext } from '../common/contexts';
import { styles } from './style';
import { BaseAxios } from '../../helpers/base-axios';
import { Converter } from '../../helpers/converter';

const { FONT_SIZE } = SPACINGS;

export const ThongTinNhanVien = () => {
  const { lang } = useContext(LangContext);
  const [cmnd, setCmnd] = useState('...');
  const [diaChi, setDiaChi] = useState('...');
  const [gioiTinh, setGioiTinh] = useState('...');
  const [maGioiTinh, setMaGioiTinh] = useState(-1);
  const [hoTen, setHoTen] = useState('...');
  const [maSoThue, setMaSoThue] = useState('...');
  const [ngayCapCMND, setNgayCapCMND] = useState('...');
  const [ngaySinh, setNgaySinh] = useState('...');
  const [noiCapCMND, setNoiCapCMND] = useState('...');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const layThongTinNV_ = async () => {
    if (mounted.current) {
      setLoading(true);
    }

    try {
      const json = await BaseAxios.get('/');
      const { data } = json;

      if (data.lv002.trim() && mounted.current) {
        setCmnd(data.lv010.trim());
        setDiaChi(data.lv034.trim());
        setGioiTinh(data.lv018 === '0' ? 'Nữ' : 'Nam');
        setMaGioiTinh(data.lv018 * 1);
        setHoTen(data.lv002.trim());
        setMaSoThue(data.lv013.trim());
        setNgayCapCMND(Converter.ymdToDmy(data.lv011));
        setNgaySinh(Converter.ymdToDmy(data.lv015));
        setNoiCapCMND(data.lv012.trim());
        setError(false);
        setLoading(false);
      } else {
        throw Error('Something went wrong');
      }
    } catch {
      if (mounted.current) {
        setError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    layThongTinNV_();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <View>
      {loading && (
        <ActivityIndicator animating={true} size="large" color="#40adf5" />
      )}
      {!loading && error && (
        <View style={styles.errorView}>
          <Text style={commonStyles.content}>
            {MESSAGES[lang].GET_STAFF_INFO_FAIL}
          </Text>
          <View style={styles.buttonContainer}>
            <Icon.Button
              name="refresh"
              backgroundColor={COLORS.PRIMARY}
              borderRadius={2}
              onPress={() => {
                layThongTinNV_();
              }}
              size={FONT_SIZE}
              color={COLORS.LIGHT}>
              <Text style={styles.button}>Thử lại</Text>
            </Icon.Button>
          </View>
        </View>
      )}
      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.loadedView}>
          <View style={styles.nameWrapper}>
            {maGioiTinh === 0 ? (
              <Image source={require('../../assets/images/woman.png')} />
            ) : (
              <Image source={require('../../assets/images/man.png')} />
            )}
            <View>
              <Text style={styles.name}>{hoTen}</Text>
              <Text style={styles.gender}>{gioiTinh}</Text>
            </View>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>CMND - CCCD</Text>
            <Text style={commonStyles.content}>{cmnd}</Text>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>Ngày cấp</Text>
            <Text style={commonStyles.content}>{ngayCapCMND}</Text>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>Nơi cấp</Text>
            <Text style={commonStyles.content}>{noiCapCMND}</Text>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>Mã số thuế</Text>
            <Text style={commonStyles.content}>
              {maSoThue ? maSoThue : '(Không có thông tin)'}
            </Text>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>Ngày sinh</Text>
            <Text style={commonStyles.content}>{ngaySinh}</Text>
          </View>
          <View style={commonStyles.formGroup}>
            <Text style={commonStyles.label}>Địa chỉ</Text>
            <Text style={commonStyles.content}>
              {diaChi ? diaChi : '(Không có thông tin)'}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
