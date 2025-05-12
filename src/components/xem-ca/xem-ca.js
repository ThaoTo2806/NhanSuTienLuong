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
import {loadData1} from '../../services/baocaocong';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS as KEYS} from '../../assets/storage-keys';

const {formGroup, label, content: contentStyle} = commonStyles;
const {BORDER_RADIUS, FONT_SIZE, MARGIN, PADDING} = SPACINGS;

export const XemCa = () => {
  const {lang} = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState(false);
  const [cellPerRow, setCellPerRow] = useState(7);
  const [cellWidth, setCellWidth] = useState(50);
  const [loaiBaoCao, setLoaiBaoCao] = useState('theo giờ');
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const mounted = useRef(true);

  const handleSaveReportType = reportType => {
    setLoaiBaoCao(reportType);
    setIsReportModalVisible(false);
  };

  const layBangCa_ = useCallback(async () => {
    let token = '';
    let userName = '';

    try {
      token = await AsyncStorage.getItem(KEYS.TOKEN);
      userName = await AsyncStorage.getItem(KEYS.USERNAME);
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
      if (loaiBaoCao === 'theo ca') {
        const query = {
          table: 'tc_lv0011',
          func: 'data',
          month: thang,
          year: nam,
        };

        const json = await BaseAxios.get('/', {query});
        newData = json.data
          .map(d => ({
            day: dayjs(d.lv004).date(),
            text: d.lv015 ? d.lv015 : '',
          }))
          .sort((a, b) => a.day - b.day);
      } else {
        newData = await loadData1(
          token,
          '0012',
          userName,
          nam,
          thang,
          'select2',
        );
        console.log('newData', newData.data);
      }

      if (mounted.current) {
        setLoading(false);
        if (loaiBaoCao === 'theo ca') setData(newData);
        else setData(newData.data);
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

  const onLayout_ = () => {
    const {width} = Dimensions.get('window');
    const newCellPerRow = 7; // Cố định 7 cột cho tuần

    const newCellWidth = parseInt(
      (width - (MARGIN + PADDING + 1) * 2) / newCellPerRow,
      10,
    );

    if (mounted.current) {
      setCellPerRow(newCellPerRow);
      setCellWidth(newCellWidth);
    }
  };

  useEffect(() => {
    onLayout_(); // gọi khi khởi tạo

    const subscription = Dimensions.addEventListener('change', () => {
      onLayout_(); // gọi lại khi xoay màn hình
    });

    return () => {
      mounted.current = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    layBangCa_();
  }, [layBangCa_]);

  const generateGrid_ = () => {
    const todayText = dayjs().format('YYYYMMDD');
    const schedulerRows = [];

    const firstDayOfMonth = dayjs(new Date(nam, thang - 1, 1));
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const firstDayWeekday = firstDayOfMonth.day(); // 0 = Sunday
    const adjustedFirstDayWeekday = (firstDayWeekday + 6) % 7; // Chuyển CN về cuối tuần

    const dataMap = new Map(data.map(item => [parseInt(item.day), item.text]));

    const emptyCells = Array.from({length: adjustedFirstDayWeekday}).map(
      (_, index) => (
        <DayCell
          today={false}
          onPress={() => {}}
          day={null}
          text={null}
          key={`emptycell-${index}`}
          fontSize={FONT_SIZE}
          width={cellWidth}
        />
      ),
    );

    let schedulerCells = [...emptyCells];

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = dayjs(new Date(nam, thang - 1, d));
      const currentDayOfWeek = currentDate.day(); // 0 = CN

      let textColor;
      if (currentDayOfWeek === 0) {
        textColor = 'red';
      } else if (currentDayOfWeek === 6) {
        textColor = 'green';
      } else {
        textColor = COLORS.BLACK;
      }

      const cell = (
        <DayCell
          today={todayText === currentDate.format('YYYYMMDD')}
          onPress={() => {}}
          day={d}
          text={dataMap.get(d) || null}
          key={`cell-${d}`}
          fontSize={FONT_SIZE}
          width={cellWidth}
          textColor={textColor}
        />
      );

      schedulerCells.push(cell);

      if (schedulerCells.length % cellPerRow === 0 || d === daysInMonth) {
        const soCotThieu = cellPerRow - (schedulerCells.length % cellPerRow);
        if (soCotThieu !== cellPerRow) {
          for (let j = 0; j < soCotThieu; j++) {
            schedulerCells.push(
              <DayCell
                today={false}
                onPress={() => {}}
                day={null}
                text={null}
                key={`emptycell-${d}-fill-${j}`}
                fontSize={FONT_SIZE}
                width={cellWidth}
              />,
            );
          }
        }

        schedulerRows.push(
          <View style={styles.rowStyle} key={`row-${d}`}>
            {schedulerCells}
          </View>,
        );

        schedulerCells = [];
      }
    }

    return <View>{schedulerRows}</View>;
  };

  return (
    <View>
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
          <Text style={label}>Lịch {loaiBaoCao} làm việc</Text>

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
                  Chọn loại lịch làm việc
                </Text>

                {['theo ca', 'theo giờ'].map(type => (
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
          <View
            style={[
              style1.daysOfWeekContainer,
              {width: cellPerRow * cellWidth},
            ]}>
            {Array.from({length: cellPerRow}).map((_, index) => {
              const dayNames = [
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun',
              ];
              const label = index < 7 ? dayNames[index] : '';
              return (
                <Text
                  key={`day-label-${index}`}
                  style={[
                    style1.dayOfWeekText,
                    {width: cellWidth, textAlign: 'center'},
                  ]}>
                  {label}
                </Text>
              );
            })}
          </View>

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
                    layBangCa_();
                  }}
                  size={FONT_SIZE}
                  color={COLORS.LIGHT}>
                  <Text style={styles.buttonText}>Thử lại</Text>
                </Icon.Button>
              </View>
            </View>
          )}
          {!loading && !error && data.length === 0 && (
            <Text style={contentStyle}>{MESSAGES[lang].CHUA_XEP_CA}</Text>
          )}
          {!loading && !error && data.length > 0 && generateGrid_()}
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
    color: '#1f3d7a',
  },
});
