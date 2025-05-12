import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons'; 
import dayjs from 'dayjs';
import { MonthPicker } from '../common/month-picker/month-picker';
import { commonStyles } from '../../assets/common-styles';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';
import { styles } from './style';
import { BaseAxios } from '../../helpers/base-axios';

const { FONT_SIZE } = SPACINGS;

const { formGroup, label, content: contentStyle } = commonStyles;

// eslint-disable-next-line react/prop-types
export const DanhSachDonXinPhep = ({ route }) => {
  const [activeSections, setActiveSections] = useState([]);
  const [data, setData] = useState([]);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const _fetchDanhSachDonXinPhep = useCallback(async () => {
    mounted.current && setRefreshing(true);

    let state;

    switch (route.name) {
      case 'DaDuyet':
        state = 1;
        break;
      case 'KhongDuyet':
        state = -1;
        break;
      case 'DoiDuyet':
        state = 0;
        break;
    }

    const query = {
      table: 'jo_lv0004',
      func: 'data',
      year: nam,
      month: thang,
      state,
    };

    try {
      const json = await BaseAxios.get('/', { query });

      const newData = json.data.map(d => ({
        tenMaCong: d.TenMaCong,
        ghiChuMaCong: d.GhiChuMaCong,
        codeHinhThucNghi: d.CodeHinhThucNghi,
        caLamViec: d.lv002,
        tuNgay: dayjs(d.lv016, 'YYYY-MM-DD HH:mm:ss'),
        denNgay: dayjs(d.lv017, 'YYYY-MM-DD HH:mm:ss'),
        lyDo: d.lv008,
      }));

      if (mounted.current) {
        setActiveSections([]);
        setData(newData);
        setRefreshing(false);
      }
    } catch (error) {
      if (mounted.current) {
        setRefreshing(false);
        Alert.alert('', error.message, [
          {
            text: 'OK',
          },
        ]);
      }
    }
  }, [nam, thang, route.name]);

  useEffect(() => {
    _fetchDanhSachDonXinPhep();
  }, [_fetchDanhSachDonXinPhep]);

  const _renderHeader = (content, _index, isActive) => {
    const icon = isActive ? 'caret-down' : 'caret-back';

    return (
      <View style={styles.headerWrapper}>
        <View style={styles.headerIconWrapper}>
          <Icon name={icon} size={FONT_SIZE * 1.4} color={COLORS.SECONDARY} />
        </View>
        <Text style={styles.accordionTitle}>
          {content.tuNgay.format('DD/MM/YYYY')}
        </Text>
      </View>
    );
  };

  const _renderContent = content => {
    return (
      <View style={{ backgroundColor: COLORS.LIGHT }}>
        <View style={formGroup}>
          <View style={styles.groupWrapper}>
            <Text style={label}>Từ ngày</Text>
            <Text style={contentStyle}>
              {content.tuNgay.format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
          <View style={styles.groupWrapper}>
            <Text style={label}>Đến ngày</Text>
            <Text style={contentStyle}>
              {content.denNgay.format('DD/MM/YYYY HH:mm')}
            </Text>
          </View>
          <View style={styles.groupWrapper}>
            <Text style={label}>Loại đơn</Text>
            <Text style={contentStyle}>{`${content.tenMaCong} (${
              content.ghiChuMaCong
            })`}</Text>
          </View>
          <View style={styles.groupWrapper}>
            <Text style={label}>Hình thức nghỉ</Text>
            <Text style={contentStyle}>{content.codeHinhThucNghi}</Text>
          </View>
          <View style={styles.groupWrapper}>
            <Text style={label}>Ca làm việc</Text>
            <Text style={contentStyle}>{content.caLamViec}</Text>
          </View>
          <View style={styles.groupWrapper}>
            <Text style={label}>Lý do</Text>
            <Text style={contentStyle}>{content.lyDo}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.screenWrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={_fetchDanhSachDonXinPhep}
          />
        }>
        <View style={formGroup}>
          <Text style={label}>Tháng</Text>
          <MonthPicker
            fontSize={FONT_SIZE}
            onChange={(m, y) => {
              if (mounted.current) {
                setThang(m);
                setNam(y);
              }
            }}
            style={contentStyle}
          />
        </View>
        <View style={formGroup}>
          <Text style={label}>Danh sách đơn</Text>
          {!refreshing && data.length > 0 && (
            <Accordion
              activeSections={activeSections}
              duration={100}
              expandMultiple={true}
              onChange={activeSecs => {
                if (mounted.current) {
                  setActiveSections(activeSecs);
                }
              }}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              sections={data}
              touchableComponent={props => <TouchableOpacity {...props} />}
              underlayColor={COLORS.MUTED}
            />
          )}
          {!refreshing && data.length === 0 && (
            <Text style={contentStyle}>
              Không có đơn nghỉ phép
              {route.name === 'DaDuyet'
                ? ' đã '
                : route.name === 'KhongDuyet'
                ? ' không được '
                : ' chưa '}
              duyệt trong tháng này
            </Text>
          )}
        </View>
      </ScrollView>
    </>
  );
};
