import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { MonthPicker } from '../common/month-picker/month-picker';
import { commonStyles } from '../../assets/common-styles';
import { COLORS } from '../../assets/colors';
import { MESSAGES } from '../../assets/messages';
import { SPACINGS } from '../../assets/spacings';
import { LangContext } from '../common/contexts';
import { styles } from './style';
import { BaseAxios } from '../../helpers/base-axios';

const { FONT_SIZE, MARGIN } = SPACINGS;

const { formGroup, label, content: contentStyle } = commonStyles;

// eslint-disable-next-line react/prop-types
export const DuyetPhep = ({ route }) => {
  const { lang } = useContext(LangContext);
  const [activeSections, setActiveSections] = useState([]);
  const [data, setData] = useState([]);
  const [thang, setThang] = useState(dayjs());
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const _fetchDanhSachDonXinPhep = useCallback(async () => {
    mounted.current && setRefreshing(true);

    let state;
    let table = 'jo_lv00';
    let { name: routeName } = route;
    const cap = routeName.substr(-1) * 1;

    routeName = routeName.substr(0, routeName.length - 4);

    switch (routeName) {
      case 'DoiDuyet':
        state = 0;

        switch (cap) {
          case 1:
            table += '08';
            break;
          case 2:
            table += '12';
            break;
          case 3:
            table += '22';
            break;
        }

        break;
      case 'DaDuyet':
        state = 1;

        switch (cap) {
          case 1:
            table += '09';
            break;
          case 2:
            table += '13';
            break;
          case 3:
            table += '23';
            break;
        }

        break;
      case 'KhongDuyet':
        state = -1;

        switch (cap) {
          case 1:
            table += '10';
            break;
          case 2:
            table += '14';
            break;
          case 3:
            table += '24';
            break;
        }

        break;
    }

    const query = {
      table,
      func: 'data',
      state,
    };

    // Đơn đã duyệt hoặc không duyệt thì lấy theo tháng, đơn chờ duyệt thì lấy tất cả
    if (state !== 0) {
      query.datefrom = thang.startOf('month').format('YYYY-MM-DD');
      query.dateto = thang.endOf('month').format('YYYY-MM-DD');
    }

    try {
      const json = await BaseAxios.get('/', { query });

      const newData = json.data.map(d => ({
        tenMaCong: d.TenMaCong,
        ghiChuMaCong: d.GhiChuMaCong,
        codeHinhThucNghi: d.HinhThucNghi,
        caLamViec: d.lv002,
        tuNgay: dayjs(d.lv016, 'YYYY-MM-DD HH:mm:ss'),
        denNgay: dayjs(d.lv017, 'YYYY-MM-DD HH:mm:ss'),
        lyDo: d.lv008,
        tenNhanVien: d.TenNhanVien,
        tenPhongBan: d.TenPhongBan,
        id: d.lv001,
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
  }, [route, thang]);

  useEffect(() => {
    _fetchDanhSachDonXinPhep();
  }, [_fetchDanhSachDonXinPhep]);

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

  const _confirm = (message, action) => {
    Alert.alert(
      '',
      message,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            action();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false },
    );
  };

  const _xuLyPhep = async (ids, isApprove) => {
    setSaving(true);

    let table = 'jo_lv00';
    const cap = route.name.substr(-1) * 1;

    switch (cap) {
      case 1:
        table += '08';
        break;
      case 2:
        table += '12';
        break;
      case 3:
        table += '22';
        break;
    }

    const codesend = ids.join('@');

    const query = {
      table,
      func: isApprove ? 'approval' : 'unapproval',
      codesend,
    };

    try {
      const json = await BaseAxios.post('/', null, { query });

      if (mounted.current) {
        setSaving(false);

        if (json.data.successfull) {
          _alert(
            isApprove
              ? MESSAGES[lang].DUYET_PHEP_THANH_CONG
              : MESSAGES[lang].TU_CHOI_PHEP_THANH_CONG,
            _fetchDanhSachDonXinPhep,
          );
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
  };

  const _renderHeader = (content, _index, isActive) => {
    let icon = isActive ? 'caret-down' : 'caret-right';
    const {
      headerWrapper,
      headerIconWrapper,
      headerLabelWrapper,
      headerLabel,
      headerLabelActive,
      staffName,
      deparment,
    } = styles;

    return (
      <View style={headerWrapper}>
        <View style={headerIconWrapper}>
          <FontAwesomeIcon
            name={icon}
            size={FONT_SIZE * 1.4}
            color={COLORS.SECONDARY}
          />
        </View>
        <View style={headerLabelWrapper}>
          <Text
            style={[
              headerLabel,
              staffName,
              isActive ? headerLabelActive : null,
            ]}>
            {content.tenNhanVien}
          </Text>
          <Text
            style={[
              headerLabel,
              deparment,
              isActive ? headerLabelActive : null,
            ]}>
            {content.tenPhongBan}
          </Text>
        </View>
      </View>
    );
  };

  const _renderContent = content => {
    return (
      <View style={{ backgroundColor: COLORS.LIGHT }}>
        <View style={formGroup}>
          {route.name.includes('DoiDuyet') && (
            <View style={styles.buttonsWrapper}>
              <View style={{ marginRight: MARGIN }}>
                <Icon.Button
                  name="check"
                  backgroundColor={COLORS.SUCCESS}
                  color={COLORS.LIGHT}
                  onPress={() => {
                    _xuLyPhep([content.id], true);
                  }}
                  size={FONT_SIZE}>
                  <Text style={[styles.buttonText, { color: COLORS.LIGHT }]}>
                    Duyệt
                  </Text>
                </Icon.Button>
              </View>
              <View style={{ marginLeft: MARGIN }}>
                <Icon.Button
                  name="cancel"
                  backgroundColor={COLORS.WARNING}
                  color={COLORS.DANGER}
                  onPress={() => {
                    _xuLyPhep([content.id], false);
                  }}
                  size={FONT_SIZE}>
                  <Text style={[styles.buttonText, { color: COLORS.DANGER }]}>
                    Từ chối
                  </Text>
                </Icon.Button>
              </View>
            </View>
          )}
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
        {route.name.substr(0, 3) !== 'Doi' && (
          <View style={formGroup}>
            <Text style={label}>Tháng</Text>
            <MonthPicker
              fontSize={FONT_SIZE}
              onChange={(m, y) => {
                if (mounted.current) {
                  setThang(dayjs(`${y}-${m}`, 'YYYY-M'));
                }
              }}
              style={contentStyle}
            />
          </View>
        )}
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
              {route.name.substr(0, 2) === 'Da'
                ? ' đã '
                : route.name.substr(0, 5) === 'Khong'
                ? ' không được '
                : ' chưa '}
              duyệt
              {route.name.substr(0, 3) !== 'Doi' ? ' trong tháng này' : ''}
            </Text>
          )}
        </View>
      </ScrollView>
      {route.name.includes('DoiDuyet') && data.length > 0 && (
        <View style={styles.approveAllButton}>
          <Icon.Button
            name="check-all"
            backgroundColor={COLORS.SUCCESS}
            color={COLORS.LIGHT}
            onPress={() => {
              _confirm(
                'Vui lòng xác nhận bạn muốn duyệt tất cả đơn xin phép?',
                () => {
                  const ids = data.map(d => d.id);

                  _xuLyPhep(ids, true);
                },
              );
            }}
            size={FONT_SIZE}>
            <Text style={[styles.buttonText, { color: COLORS.LIGHT }]}>
              Duyệt tất cả
            </Text>
          </Icon.Button>
        </View>
      )}
      {saving && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      )}
    </>
  );
};
