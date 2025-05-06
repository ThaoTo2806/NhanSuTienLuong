import React, {
  useCallback,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import {DayCell} from '../common/day-cell/day_cell';
import {MonthPicker} from '../common/month-picker/month-picker';
import {commonStyles} from '../../assets/common-styles';
import {COLORS} from '../../assets/colors';
import {SPACINGS} from '../../assets/spacings';
import {MESSAGES} from '../../assets/messages';
import {LangContext} from '../common/contexts';
import {styles} from './style';
import {BaseAxios} from '../../helpers/base-axios';
import {loadData, loadData1, loadData2} from '../../services/baocaocong';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS as KEYS} from '../../assets/storage-keys';

const {formGroup, label, content: contentStyle} = commonStyles;
const {BORDER_RADIUS, FONT_SIZE, MARGIN, PADDING} = SPACINGS;

export const BaoCaoCong = () => {
  const {lang} = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState(false);
  const [cellPerRow, setCellPerRow] = useState(null);
  const [cellWidth, setCellWidth] = useState(null);
  const [loaiBaoCao, setLoaiBaoCao] = useState('Theo ca');
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const mounted = useRef(true);

  const handleSaveReportType = reportType => {
    setLoaiBaoCao(reportType);
    setIsReportModalVisible(false);
  };

  const layBangCong = useCallback(async () => {
    console.log('layBangCong');
    let token = '';
    let userName = '';

    try {
      token = await AsyncStorage.getItem(KEYS.TOKEN);
      userName = await AsyncStorage.getItem(KEYS.USERNAME);
      console.log('layBangCong1111');
      console.log('token', token);
      console.log('userName', userName);
    } catch (err) {
      console.log('LỖI LẤY TOKEN HOẶC USERNAME:', err);
      return; // dừng hàm nếu không lấy được token/username
    }

    if (mounted.current) {
      setLoading(true);
    }

    try {
      const thangStr = thang < 10 ? '0' + thang : thang.toString();
      const dateStart = `${nam}-${thangStr}-01`;
      const dateEnd = dayjs(dateStart)
        .add(1, 'M')
        .subtract(1, 'd')
        .format('YYYY-MM-DD');

      let newData = [];

      if (loaiBaoCao === 'Theo ca') {
        newData = await loadData(token, '0011', userName, '2018', 'select');
        console.log('newData', newData);
      } else if (loaiBaoCao === 'Theo giờ') {
        newData = await loadData1(token, '0012', userName, nam, 'select');
        console.log('newData', newData);
      } else {
        newData = await loadData2(token, '0011', userName, nam, 'select2');
        console.log('newData', newData);
      }

      if (mounted.current) {
        setLoading(false);
        setData(newData.data);
        setError(false);
      }
    } catch {
      if (mounted.current) {
        setLoading(false);
        setData([]);
        setError(true);
      }
    }
  }, [nam, thang, loaiBaoCao]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    layBangCong();
  }, [layBangCong]);

  const onLayout_ = () => {
    const {height, width} = Dimensions.get('window');
    const ratio = width / height;

    let newCellPerRow;

    if (ratio < 0.7) {
      newCellPerRow = 7;
    } else if (ratio <= 1) {
      newCellPerRow = 5;
    } else if (ratio <= 1.4) {
      newCellPerRow = 7;
    } else {
      newCellPerRow = 8;
    }

    const newCellWidth = parseInt(
      (width - (MARGIN + PADDING + 1) * 2) / newCellPerRow,
      10,
    );

    if (mounted.current) {
      setCellPerRow(newCellPerRow);
      setCellWidth(newCellWidth);
    }
  };

  const generateGrid_ = () => {
    return (
      <View>
        <Text>Hello world!</Text>
      </View>
    );
  };

  return (
    <View onLayout={onLayout_}>
      <ScrollView>
        <View style={formGroup}>
          <Text style={label}>Tháng</Text>
          <MonthPicker
            fontSize={FONT_SIZE}
            onChange={(t, n) => {
              if (mounted.current) {
                setThang(t);
                setNam(n);
              }
            }}
            selected={new Date(nam, thang - 1, 1)}
            style={contentStyle}
          />
        </View>
        <View style={formGroup}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#007bff', fontSize: 16}}>Loại báo cáo</Text>

            <TouchableOpacity
              onPress={() => setIsReportModalVisible(true)}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                paddingVertical: 6,
                paddingHorizontal: 80,
                borderRadius: 6,
              }}>
              <Text style={{fontSize: 16, color: '#3973ac'}}>{loaiBaoCao}</Text>
            </TouchableOpacity>
          </View>

          {/* Modal chọn loại báo cáo */}
          <Modal
            visible={isReportModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsReportModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  width: '80%',
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
                  Chọn loại báo cáo
                </Text>

                {['Theo ca', 'Theo giờ', 'Theo công'].map(type => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleSaveReportType(type)}>
                    <Text
                      style={{
                        padding: 10,
                        fontSize: 16,
                        color: loaiBaoCao === type ? 'green' : 'black',
                      }}>
                      {loaiBaoCao === type ? '✔ ' : ''}
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}

                <Button
                  title="Cancel"
                  onPress={() => setIsReportModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </View>

        <View style={formGroup}>
          {loading && (
            <ActivityIndicator
              animating={true}
              size="large"
              color="#40adf5"
              style={{marginTop: MARGIN * 2}}
            />
          )}
          {error && (
            <View>
              <Text style={contentStyle}>{MESSAGES[lang].LOI_LIET_KE_CA}</Text>
              <View style={styles.buttonWrapper}>
                <Icon.Button
                  name="refresh"
                  backgroundColor={COLORS.PRIMARY}
                  borderRadius={BORDER_RADIUS}
                  iconStyle={styles.buttonIcon}
                  onPress={() => {
                    layBangCong();
                  }}
                  size={FONT_SIZE}
                  color={COLORS.LIGHT}>
                  <Text style={styles.buttonText}>Thử lại</Text>
                </Icon.Button>
              </View>
            </View>
          )}
          {!loading && !error && (
            <Text style={contentStyle}>{MESSAGES[lang].CHUA_XEP_CA}</Text>
          )}
          {!loading && !error && generateGrid_()}
        </View>
      </ScrollView>
    </View>
  );
};

const style1 = StyleSheet.create({
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006bb3',
    textAlign: 'center',
    width: 50,
  },
});
