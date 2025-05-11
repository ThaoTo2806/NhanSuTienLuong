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
  Alert,
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
import {loadData, loadData1, insertData} from '../../services/dangkycom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS as KEYS} from '../../assets/storage-keys';

const {formGroup, label, content: contentStyle} = commonStyles;
const {BORDER_RADIUS, FONT_SIZE, MARGIN, PADDING} = SPACINGS;

export const DangKyCom = () => {
  const {lang} = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [data1, setData1] = useState({});
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState(false);
  const [cellPerRow, setCellPerRow] = useState(7);
  const [cellWidth, setCellWidth] = useState(50);
  const [isRegisVisible, setIsRegisVisible] = useState(false);
  const [showNoiAnModal, setShowNoiAnModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedNoiAn, setSelectedNoiAn] = useState('');
  const [selectedBuois, setSelectedBuois] = useState([]);
  const [selectedMons, setSelectedMons] = useState([]);
  const [selectedLans, setSelectedLans] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const mounted = useRef(true);

  const layBangCa_ = useCallback(async () => {
    let token = '';
    let userName = '';

    try {
      token = await AsyncStorage.getItem(KEYS.TOKEN);
      userName = await AsyncStorage.getItem(KEYS.USERNAME);
      // console.log('token', token);
      // console.log('userName', userName);
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
      // console.log('nam:', nam);
      // console.log('thang:', thang);
      newData = await loadData(token, '0011', userName, nam, thang, 'select3');
      //console.log('newData', newData.data);
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
  }, [nam, thang]);

  const openRegis = () => {
    setIsRegisVisible(prev => !prev);
  };

  const toggleLanAn = lan => {
    if (selectedLans.includes(lan)) {
      // Bỏ chọn nếu đã chọn
      setSelectedLans([]);
    } else {
      // Chỉ chọn 1 lần ăn duy nhất
      setSelectedLans([lan]);
    }
  };

  const toggleBuoiAn = i => {
    setSelectedBuois(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i],
    );
  };
  const toggleLoaiMonAn = i => {
    setSelectedMons(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i],
    );
  };

  const getAvailableDates = () => {
    const today = dayjs();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = today.add(i, 'day');
      dates.push({
        value: date.format('YYYY-MM-DD'),
        isPast: date.isBefore(today, 'day'),
      });
    }

    return dates;
  };

  const handleDangKy = async () => {
    let token = '';
    let userName = '';

    try {
      token = await AsyncStorage.getItem(KEYS.TOKEN);
      userName = await AsyncStorage.getItem(KEYS.USERNAME);
      //console.log('token', token);
      //onsole.log('userName', userName);
    } catch (err) {
      console.log('LỖI LẤY TOKEN HOẶC USERNAME:', err);
      return; // dừng hàm nếu không lấy được token/username
    }
    if (
      !selectedNoiAn ||
      selectedDates.length === 0 ||
      selectedBuois.length === 0 ||
      selectedMons.length === 0 ||
      selectedLans.length === 0
    ) {
      Alert.alert('Thiếu thông tin', 'Vui lòng chọn đầy đủ các mục.');
      return;
    }

    const today = dayjs();

    const invalidBuoiDates = selectedDates.filter(dateStr => {
      const isToday = dayjs(dateStr).isSame(today, 'day');
      if (!isToday) return false;

      // Kiểm tra từng buổi
      for (const buoi of selectedBuois) {
        if (
          (buoi === 'Sáng' || buoi === 'Trưa') &&
          today.isAfter(dayjs().hour(8).minute(20))
        ) {
          return true;
        }
        if (buoi === 'Chiều' && today.isAfter(dayjs().hour(16).minute(20))) {
          return true;
        }
      }

      return false;
    });

    if (invalidBuoiDates.length > 0) {
      Alert.alert(
        'Thông báo',
        `Đã quá thời gian đăng ký cơm cho ngày: ${invalidBuoiDates.join(', ')}`,
      );
      return;
    }

    const selectedLan = selectedLans[0]; // vì chỉ cho chọn 1 lần ăn

    if (
      selectedLan === 1 &&
      selectedBuois.length > 1 &&
      selectedMons.length > 1
    ) {
      Alert.alert(
        'Thông báo',
        'Chỉ được chọn 1 buổi ăn cho 1 lần ăn trong ngày!',
      );
      return;
    } else if (selectedLan === 1 && selectedMons.length > 1) {
      Alert.alert('Thông báo', 'Chỉ được chọn 1 món cho 1 lần ăn trong ngày!');
      return;
    }

    if (selectedLan === 2 && selectedBuois.length > 2) {
      Alert.alert(
        'Thông báo',
        'Chỉ được chọn tối đa 2 buổi ăn cho 2 lần ăn trong ngày!',
      );
      return;
    }

    if (selectedMons.length > 1) {
      Alert.alert('Thông báo', 'Chỉ được chọn Ăn Mặn hoặc Ăn Chay!');
      return;
    }

    try {
      const result = await insertData(
        token,
        '0011',
        userName,
        'insert',
        selectedNoiAn,
        selectedDates,
        selectedLan,
        selectedMons,
        selectedBuois,
      );

      if (result.success) {
        setSelectedDates([]);
        setSelectedNoiAn([]);
        setSelectedBuois([]);
        setSelectedMons([]);
        setSelectedLans([]);
        setRefreshKey(prev => prev + 1);
        //Alert.alert('Đăng ký cơm thành công', result.message);
      } else {
        const message = result.message?.trim()
          ? result.message
          : 'Bạn đã đăng ký cơm rồi';
        Alert.alert('Đăng ký cơm thất bại', message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

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

  useEffect(() => {
    mounted.current = true;
    layBangCa_();

    return () => {
      mounted.current = false;
    };
  }, [nam, thang, refreshKey]);

  const handleSelectMon = async (type, dayStr, currentDate) => {
    const today = dayjs();
    const isToday = currentDate.isSame(today, 'day');
    const tooLate = isToday && today.isAfter(dayjs().hour(8).minute(20));

    if (tooLate) {
      Alert.alert('Thông báo', 'Đã quá thời gian đăng ký cơm trong ngày!');
      return;
    }

    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    const userName = await AsyncStorage.getItem(KEYS.USERNAME);
    const kho = await AsyncStorage.getItem(KEYS.KHO);

    const dateString = currentDate.format('YYYY-MM-DD');

    const monValue = type === 'man' ? 'Mặn' : 'Chay';

    const payloadDates = [dateString];
    const payloadMons = [monValue];
    const payloadBuois = ['Trưa'];
    const payloadLan = '1';
    console.log('token:', token);
    console.log('userNames:', userName);
    console.log('selectedNoiAn:', kho);
    console.log('selectedDates:', payloadDates);
    console.log('selectedBuois:', payloadBuois);
    console.log('selectedLan:', payloadLan);
    console.log('selectedMons:', payloadMons);

    try {
      const result = await insertData(
        token,
        '0011',
        userName,
        'insert',
        kho,
        payloadDates,
        payloadLan,
        payloadMons,
        payloadBuois,
      );

      if (result.success) {
        Alert.alert('Đăng ký cơm thành công', result.message);
        setRefreshKey(prev => prev + 1);
      } else {
        const message = result.message?.trim()
          ? result.message
          : 'Bạn đã đăng ký cơm rồi';
        Alert.alert('Đăng ký cơm thất bại', message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  const generateGrid_ = () => {
    const schedulerRows = [];

    const firstDayOfMonth = dayjs(new Date(nam, thang - 1, 1));
    const daysInMonth = firstDayOfMonth.daysInMonth();
    const firstDayWeekday = firstDayOfMonth.day(); // 0 = Sunday
    const adjustedFirstDayWeekday = (firstDayWeekday + 6) % 7;

    const dataMap = new Map();
    data.forEach(d => {
      dataMap.set(d.lv004_ngay.padStart(2, '0'), d);
    });

    const totalCells = adjustedFirstDayWeekday + daysInMonth;
    const rows = Math.ceil(totalCells / 7);
    let dayCounter = 1 - adjustedFirstDayWeekday;

    const now = dayjs();

    for (let r = 0; r < rows; r++) {
      const row = [];

      for (let c = 0; c < 7; c++) {
        if (dayCounter < 1 || dayCounter > daysInMonth) {
          row.push(
            <View
              key={`empty-${r}-${c}`}
              style={{width: cellWidth, height: 60}}
            />,
          );
        } else {
          const currentDay = dayCounter;
          const dayStr = currentDay.toString().padStart(2, '0');
          const record = dataMap.get(dayStr);

          const khongan = record?.khongan === '1';
          const man = record?.man === '1';
          const chay = record?.chay === '1';

          const currentDate = dayjs(new Date(nam, thang - 1, currentDay));
          const dayOfWeek = currentDate.day();
          let dayColor = '#0080ff';
          if (dayOfWeek === 0) dayColor = 'red';
          else if (dayOfWeek === 6) dayColor = 'green';

          // Kiểm tra nếu là hôm nay và quá 8:20
          const tooLate =
            currentDate.isBefore(now, 'day') ||
            (currentDate.isSame(now, 'day') &&
              now.isAfter(dayjs().hour(8).minute(20)));

          row.push(
            <TouchableOpacity
              key={`day-${dayCounter}`}
              style={{
                width: cellWidth,
                height: 60,
                padding: 2,
                alignItems: 'center',
              }}
              onPress={() => getInfo_(currentDay)}>
              <Text style={{fontWeight: 'bold', color: dayColor}}>
                {currentDay}
              </Text>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {!khongan && (
                  <>
                    <TouchableOpacity
                      disabled={tooLate}
                      onPress={() =>
                        handleSelectMon('man', dayStr, currentDate)
                      }>
                      <Icon
                        name={man ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={tooLate ? '#eee' : man ? 'green' : '#ccc'}
                        style={{marginRight: 6}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={tooLate}
                      onPress={() =>
                        handleSelectMon('chay', dayStr, currentDate)
                      }>
                      <Icon
                        name={chay ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={tooLate ? '#eee' : chay ? 'orange' : '#ccc'}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableOpacity>,
          );
        }

        dayCounter++;
      }

      schedulerRows.push(
        <View
          key={`row-${r}`}
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          {row}
        </View>,
      );
    }

    return <View>{schedulerRows}</View>;
  };

  const getInfo_ = async day => {
    let token = '';
    let userName = '';

    try {
      token = await AsyncStorage.getItem(KEYS.TOKEN);
      userName = await AsyncStorage.getItem(KEYS.USERNAME);
      //console.log('token', token);
      //console.log('userName', userName);
    } catch (err) {
      console.log('LỖI LẤY TOKEN HOẶC USERNAME:', err);
      return; // dừng hàm nếu không lấy được token/username
    }

    try {
      const newData = await loadData1(
        token,
        '0011',
        userName,
        nam,
        thang,
        day,
        'select4',
      );
      //console.log('newData1:', newData.data[0]);
      setSelectedDate(day);
      setData1(newData.data[0]);
    } catch {
      setData1({});
    }
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
          <TouchableOpacity
            style={style1.daysOfWeekContainer1}
            onPress={() => openRegis()}>
            <Text style={style1.lable}>Đăng ký cơm</Text>
          </TouchableOpacity>
          {isRegisVisible && (
            <View style={style1.regisContainer}>
              {/* Nơi ăn cố định */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text style={style1.textAn}>Nơi ăn cố định:</Text>
                <TouchableOpacity
                  onPress={() => setShowNoiAnModal(true)}
                  style={[style1.dropdown, {marginLeft: 10}, {width: '68%'}]}>
                  <Text style={style1.textAn1}>
                    {selectedNoiAn || 'Chọn nơi ăn'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Modal chọn nơi ăn */}
              <Modal visible={showNoiAnModal} transparent animationType="slide">
                <View style={style1.modalContainer}>
                  {['CC', 'TB', 'UN'].map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setSelectedNoiAn(option);
                        setShowNoiAnModal(false);
                      }}>
                      <Text style={style1.modalItem}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setShowNoiAnModal(false)}>
                    <Text style={style1.modalClose}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              {/* Ngày ăn */}
              <View style={{marginVertical: 5}}>
                <Text style={style1.textAn}>Ngày ăn:</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 5,
                  }}>
                  {getAvailableDates().map(({value, isPast}) => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => {
                        if (!isPast) {
                          setSelectedDates(prev =>
                            prev.includes(value)
                              ? prev.filter(d => d !== value)
                              : [...prev, value],
                          );
                        }
                      }}
                      disabled={isPast}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 10,
                        marginBottom: 8,
                        opacity: isPast ? 0.5 : 1,
                      }}>
                      <Icon
                        name={
                          selectedDates.includes(value)
                            ? 'checkbox'
                            : 'square-outline'
                        }
                        size={18}
                        color={isPast ? '#ccc' : '#0080ff'}
                      />
                      <Text style={[style1.textAn1, {marginLeft: 4}]}>
                        {value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Lần ăn */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text style={style1.textAn}>Số lần ăn trong ngày:</Text>
                {[1, 2].map(i => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleLanAn(i)}
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={
                        selectedLans.includes(i)
                          ? 'radio-button-on-outline'
                          : 'radio-button-off-outline'
                      }
                      size={18}
                      color="#0080ff"
                    />
                    <Text style={style1.textAn1}>{i}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Buổi ăn */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text style={style1.textAn}>Buổi ăn:</Text>
                {['Sáng', 'Trưa', 'Chiều'].map(i => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleBuoiAn(i)}
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={
                        selectedBuois.includes(i)
                          ? 'checkbox'
                          : 'square-outline'
                      }
                      size={18}
                      color="#0080ff"
                    />
                    <Text style={style1.textAn1}>{i}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Loại món ăn */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Text style={style1.textAn}>Loại món ăn:</Text>
                {['Chay', 'Mặn'].map(i => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleLoaiMonAn(i)}
                    style={{
                      marginLeft: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name={
                        selectedMons.includes(i) ? 'checkbox' : 'square-outline'
                      }
                      size={18}
                      color="#0080ff"
                    />
                    <Text style={style1.textAn1}>{i}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Nút đăng ký */}
              <TouchableOpacity style={style1.button} onPress={handleDangKy}>
                <Text style={style1.buttonText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          )}
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
          <View
            style={[
              style1.daysOfWeekContainer,
              {width: cellPerRow * cellWidth},
            ]}>
            {Array.from({length: cellPerRow}).map((_, index) => {
              return (
                <Text
                  key={`day-label-${index}`}
                  style={[
                    style1.dayOfWeekText,
                    {
                      width: cellWidth,
                      textAlign: 'center',
                      flexDirection: 'row',
                    },
                  ]}>
                  <Text style={{color: 'green'}}>M</Text>
                  <Text> | </Text>
                  <Text style={{color: 'orange'}}>C</Text>
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
          {
            !loading &&
              !error &&
              (data.length === 0 ? (
                <View>{generateGrid_()}</View> // render ô trắng
              ) : (
                generateGrid_()
              )) // render theo data
          }
        </View>

        {data1 && (
          <View style={formGroup}>
            <Text style={style1.lable}>Nội dung ăn</Text>
            <View style={{alignItems: 'flex-start'}}>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={style1.textAn}>Nơi ăn: </Text>
                <Text style={style1.textAn1}>
                  {data1.noian || 'Chưa có thông tin'}
                </Text>
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={style1.textAn}>Món ăn: </Text>
                <Text style={style1.textAn1}>
                  {(data1.man === '1' ? 'Mặn' : '') +
                    (data1.man === '1' && data1.chay === '1' ? ', ' : '') +
                    (data1.chay === '1' ? 'Chay' : '') || 'Chưa có thông tin'}
                </Text>
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={style1.textAn}>Số lần ăn trong ngày: </Text>
                <Text style={style1.textAn1}>{data1.lanan}</Text>
              </View>

              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <Text style={style1.textAn}>Ngày ăn: </Text>
                <Text style={style1.textAn1}>
                  {data1.lv004_ngay}/{data1.lv004_thang}/{nam}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const style1 = StyleSheet.create({
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    textAlign: 'center',
  },
  daysOfWeekContainer1: {
    flexDirection: 'row',
    justifyContent: 'center', // căn giữa các item theo chiều ngang
    marginBottom: 10,
  },
  dayOfWeekText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f3d7a',
    textAlign: 'center',
    width: 50,
  },
  lable: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f3d7a',
    textAlign: 'center',
  },
  textAn: {
    fontSize: 16,
    color: '#1f3d7a',
    fontWeight: 'bold',
  },
  textAn1: {
    fontSize: 16,
    color: '#1f3d7a',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 30,
    padding: 20,
    borderRadius: 12,
    elevation: 10,
    justifyContent: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    fontSize: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    color: '#0080ff',
  },
  modalClose: {
    marginTop: 10,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0080ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
