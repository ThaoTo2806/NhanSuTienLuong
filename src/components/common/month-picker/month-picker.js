import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import dayjs from 'dayjs';
import {MonthCell} from '../month-cell/month-cell.js';
import {styles} from './style';

const POPUP_MARGIN = 50;
const MONTHS =
  'Thg 1,Thg 2,Thg 3,Thg 4,Thg 5,Thg 6,Thg 7,Thg 8,Thg 9,Thg 10,Thg 11,Thg 12'.split(
    ',',
  );
const ROW_COUNT = 3;
const COL_COUNT = 4;
const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const MonthPicker = ({
  selected = new Date(),
  onChange,
  popupHeaderBgColor = '#3187fe',
  fontSize = 16,
  selectedBgColor = '#3187fe',
  selectedFgColor = '#fff',
  bgColor = '#fff',
  fgColor = '#333',
}) => {
  const [displayPopup, setDisplayPopup] = useState(false);
  const [text, setText] = useState(dayjs(selected).format('MM/YYYY'));
  const [year, setYear] = useState(selected.getFullYear());
  const [month, setMonth] = useState(selected.getMonth());
  const mounted = useRef(true);

  const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
  let pickerSize_ = Math.min(screenHeight, screenWidth);
  pickerSize_ -= (pickerSize_ % 4) + POPUP_MARGIN * 2;

  const styles_ = StyleSheet.create({
    dropDownContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 2,
      paddingLeft: 2,
    },
    text: {
      color: '#333',
      fontSize: fontSize,
    },
    textSmall: {
      color: '#373daf',
      fontSize: fontSize - 3,
    },
    popupOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(51, 51, 51, 0.7)',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    popupContainer: {
      backgroundColor: bgColor,
      width: pickerSize_,
    },
    popupHeader: {
      alignItems: 'center',
      backgroundColor: popupHeaderBgColor,
      flexDirection: 'row',
      height: pickerSize_ / 4,
      width: pickerSize_,
    },
    headerIconContainer: {
      alignItems: 'center',
      height: pickerSize_ / 4,
      justifyContent: 'center',
      width: pickerSize_ / 4,
    },
    headerTextContainer: {
      alignItems: 'center',
      height: pickerSize_ / 4,
      justifyContent: 'center',
      width: pickerSize_ / 2,
    },
    headerText: {
      color: selectedFgColor,
      fontSize: fontSize + 6,
      fontWeight: 'bold',
    },
    monthRows: {
      flexDirection: 'row',
      width: pickerSize_,
    },
    popupFooter: {
      alignItems: 'center',
      borderTopColor: popupHeaderBgColor,
      borderTopWidth: 1,
      height: pickerSize_ / 4,
      justifyContent: 'center',
      width: pickerSize_,
    },
    buttonIcon: {
      marginLeft: 10,
      marginVertical: 5,
    },
    buttonText: {
      color: selectedFgColor,
      fontSize: fontSize,
      marginRight: 10,
    },
  });

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const hidePopup_ = () => mounted.current && setDisplayPopup(false);
  const showPopup_ = () => mounted.current && setDisplayPopup(true);

  const resetMonth_ = () => {
    const date = dayjs(text, 'MM/YYYY');
    const m = date.month();
    const y = date.year();
    if (mounted.current) {
      setMonth(m);
      setYear(y);
    }
  };

  const previousMonth_ = () => {
    let m = month - 1;
    let y = year;
    if (m === -1) {
      m = 11;
      y--;
    }
    if (mounted.current) {
      setMonth(m);
      setYear(y);
      setText(dayjs(new Date(y, m, 1)).format('MM/YYYY'));
    }
    onChange(m + 1, y);
  };

  const nextMonth_ = () => {
    let m = month + 1;
    let y = year;
    if (m === 12) {
      m = 0;
      y++;
    }
    if (mounted.current) {
      setMonth(m);
      setYear(y);
      setText(dayjs(new Date(y, m, 1)).format('MM/YYYY'));
    }
    onChange(m + 1, y);
  };

  const previousYear_ = () => mounted.current && setYear(year - 1);
  const nextYear_ = () => mounted.current && setYear(year + 1);
  const monthSelect_ = m => mounted.current && setMonth(m);

  const monthRows = [];
  for (let i = 0; i < ROW_COUNT; i++) {
    const monthCells = [];
    for (let j = 0; j < COL_COUNT; j++) {
      const m = i * COL_COUNT + j;
      monthCells.push(
        <MonthCell
          fontSize={fontSize}
          key={`c${m}`}
          label={MONTHS[m]}
          month={m}
          onPress={monthSelect_}
          selected={month === m}
          selectedBgColor={selectedBgColor}
          selectedFgColor={selectedFgColor}
          size={pickerSize_ / 4}
        />,
      );
    }
    monthRows.push(
      <View style={styles_.monthRows} key={`r${i}`}>
        {monthCells}
      </View>,
    );
  }

  return (
    <View>
      <View style={styles_.dropDownContainer}>
        <Touchable onPress={showPopup_}>
          <View style={styles.wrapper}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles_.text}>
              {text}
            </Text>
            <Icon
              color={fgColor}
              size={fontSize}
              name="calendar-number-outline"
              style={styles.icon}
            />
          </View>
        </Touchable>
        <Touchable onPress={previousMonth_}>
          <View style={styles.prevMonth}>
            <Text style={styles_.textSmall}>Tháng trước</Text>
          </View>
        </Touchable>
        <Touchable onPress={nextMonth_}>
          <Text style={styles_.textSmall}>Tháng sau</Text>
        </Touchable>
      </View>
      {displayPopup && (
        <Modal
          visible={displayPopup}
          onRequestClose={() => {
            hidePopup_();
            resetMonth_();
          }}
          animationType="fade"
          transparent={true}>
          <Touchable
            onPress={() => {
              hidePopup_();
              resetMonth_();
            }}>
            <View style={styles_.popupOverlay}>
              <Touchable onPress={() => {}}>
                <View style={styles_.popupContainer}>
                  <View style={styles_.popupHeader}>
                    <Touchable onPress={previousYear_}>
                      <View style={styles_.headerIconContainer}>
                        <Icon
                          name="caret-back"
                          color={selectedFgColor}
                          size={fontSize + 10}
                        />
                      </View>
                    </Touchable>
                    <View style={styles_.headerTextContainer}>
                      <Text style={styles_.headerText}>{year}</Text>
                    </View>
                    <Touchable onPress={nextYear_}>
                      <View style={styles_.headerIconContainer}>
                        <Icon
                          name="caret-forward"
                          color={selectedFgColor}
                          size={fontSize + 10}
                        />
                      </View>
                    </Touchable>
                  </View>
                  {monthRows}
                  <View style={styles_.popupFooter}>
                    <Icon.Button
                      name="checkmark-circle-outline"
                      backgroundColor={popupHeaderBgColor}
                      borderRadius={4}
                      onPress={() => {
                        hidePopup_();
                        mounted.current &&
                          setText(
                            dayjs(new Date(year, month, 1)).format('MM/YYYY'),
                          );
                        onChange(month + 1, year);
                      }}
                      size={fontSize + 2}
                      iconStyle={styles_.buttonIcon}
                      color={selectedFgColor}>
                      <Text style={styles_.buttonText}>Chọn</Text>
                    </Icon.Button>
                  </View>
                </View>
              </Touchable>
            </View>
          </Touchable>
        </Modal>
      )}
    </View>
  );
};

MonthPicker.propTypes = {
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  popupHeaderBgColor: PropTypes.string,
  fontSize: PropTypes.number,
  selectedBgColor: PropTypes.string,
  selectedFgColor: PropTypes.string,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
};

export {MonthPicker};
