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

const {formGroup, label, content: contentStyle} = commonStyles;
const {BORDER_RADIUS, FONT_SIZE, MARGIN, PADDING} = SPACINGS;

export const DangKyCom = () => {
  const {lang} = useContext(LangContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [error, setError] = useState(false);
  const [cellPerRow, setCellPerRow] = useState(null);
  const [cellWidth, setCellWidth] = useState(null);
  const mounted = useRef(true);

  const layBangCa_ = useCallback(async () => {
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

      const query = {
        table: 'tc_lv0011',
        func: 'data',
        month: thang,
        year: nam,
      };

      const json = await BaseAxios.get('/', {query});
      const newData = json.data
        .map(d => ({
          day: dayjs(d.lv004).date(),
          text: d.lv015 ? d.lv015 : '',
        }))
        .sort((a, b) => a.day - b.day);

      if (mounted.current) {
        setLoading(false);
        setData(newData);
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

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    layBangCa_();
  }, [layBangCa_]);

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
    const todayText = dayjs().format('YYYYMMDD');
    const schedulerRows = [];
    const tongSoNgay = data.length;

    // Get the first day of the month and its weekday
    const firstDayOfMonth = dayjs(new Date(nam, thang - 1, 1));
    const firstDayWeekday = firstDayOfMonth.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Adjust the firstDayWeekday to match the desired start of the week (Monday)
    const adjustedFirstDayWeekday = (firstDayWeekday + 6) % 7; // Convert to 0 = Monday, 1 = Tuesday, ..., 6 = Sunday

    // Add empty cells for days before the first day of the month
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
    let i = 0;

    while (i < tongSoNgay) {
      const currentDate = dayjs(new Date(nam, thang - 1, data[i].day));
      const currentDayOfWeek = currentDate.day(); // Get the day of the week (0 = Sunday, 6 = Saturday)

      // Determine text color based on the day of the week
      let textColor;
      if (currentDayOfWeek === 0) {
        textColor = 'red'; // Sunday
      } else if (currentDayOfWeek === 6) {
        textColor = 'green'; // Saturday
      } else {
        textColor = COLORS.BLACK; // Default color for other days
      }

      const cell = (
        <DayCell
          today={todayText === currentDate.format('YYYYMMDD')}
          onPress={() => {}}
          day={data[i].day}
          text={data[i].text}
          key={`cell-${data[i].day}`}
          fontSize={FONT_SIZE}
          width={cellWidth}
          textColor={textColor}
        />
      );

      schedulerCells.push(cell);

      // đã đủ cột trên 1 dòng, hoặc dòng cuối
      if (schedulerCells.length === cellPerRow || i === tongSoNgay - 1) {
        // trường hợp dòng cuối chưa đủ số cột
        if (schedulerCells.length % cellPerRow !== 0) {
          const soCotThieu = cellPerRow - (schedulerCells.length % cellPerRow);

          for (let j = 0; j < soCotThieu; j++) {
            schedulerCells.push(
              <DayCell
                today={false}
                onPress={() => {}}
                day={null}
                text={null}
                key={`emptycell-${j}`}
                fontSize={FONT_SIZE}
                width={cellWidth}
              />,
            );
          }
        }

        const row = (
          <View style={styles.rowStyle} key={`row-${i}`}>
            {schedulerCells}
          </View>
        );

        schedulerRows.push(row);
        schedulerCells = [];
      }

      i++;
    }

    return <View>{schedulerRows}</View>;
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
          <Text style={label}>Lịch ca làm việc</Text>
          <View style={style1.daysOfWeekContainer}>
            <Text style={style1.dayOfWeekText}>Mon</Text>
            <Text style={style1.dayOfWeekText}>Tue</Text>
            <Text style={style1.dayOfWeekText}>Wed</Text>
            <Text style={style1.dayOfWeekText}>Thu</Text>
            <Text style={style1.dayOfWeekText}>Fri</Text>
            <Text style={style1.dayOfWeekText}>Sat</Text>
            <Text style={style1.dayOfWeekText}>Sun</Text>
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
    color: COLORS.BLACK,
    textAlign: 'center',
    width: 50,
  },
});
