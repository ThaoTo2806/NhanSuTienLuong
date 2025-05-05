import React, { useEffect, useRef, useState } from 'react';
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
import { MonthCell } from '../month-cell/month-cell.js';
import { styles } from './style';

const POPUP_MARGIN = 50;
const MONTHS = 'Thg 1,Thg 2,Thg 3,Thg 4,Thg 5,Thg 6,Thg 7,Thg 8,Thg 9,Thg 10,Thg 11,Thg 12'.split(
  ',',
);
const ROW_COUNT = 3;
const COL_COUNT = 4;
const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const MonthPicker = props => {
  const {
    bgColor,
    fgColor,
    fontSize,
    onChange,
    popupHeaderBgColor,
    selected,
    selectedBgColor,
    selectedFgColor,
  } = props;

  // The popup is displayed or not
  const [displayPopup, setDisplayPopup] = useState(false);

  // Text to display on the picker when an item is selected (selected text)
  const [text, setText] = useState(dayjs(selected).format('MM/YYYY'));

  // Selected year
  const [year, setYear] = useState(selected.getFullYear());

  // Selected month
  const [month, setMonth] = useState(selected.getMonth());

  const mounted = useRef(true);

  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

  let pickerSize_ = Math.min(screenHeight, screenWidth);

  // make size divisible by 4
  pickerSize_ -= (pickerSize_ % 4) + POPUP_MARGIN * 2;

  const styles_ = StyleSheet.create({
    dropDownContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 2,
      paddingLeft: 2,
    },
    /**
     * Month picker's text (next to calendar icon)
     */
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
    /**
     * Popup's header text
     */
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

  const hidePopup_ = () => {
    mounted.current && setDisplayPopup(false);
  };

  const showPopup_ = () => {
    mounted.current && setDisplayPopup(true);
  };

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

  const previousYear_ = () => {
    let y = year - 1;
    mounted.current && setYear(y);
  };

  const nextYear_ = () => {
    let y = year + 1;
    mounted.current && setYear(y);
  };

  const monthSelect_ = m => {
    mounted.current && setMonth(m);
  };

  const monthRows = [];

  for (let i = 0; i < ROW_COUNT; i++) {
    const monthCells = [];

    for (let j = 0; j < COL_COUNT; j++) {
      const m = i * COL_COUNT + j;
      const cell = (
        <MonthCell
          fontSize={fontSize}
          key={`c${m}`}
          label={MONTHS[m]}
          month={m}
          onPress={selectedMonth => {
            monthSelect_(selectedMonth);
          }}
          selected={month === m}
          selectedBgColor={selectedBgColor}
          selectedFgColor={selectedFgColor}
          size={pickerSize_ / 4}
        />
      );

      monthCells.push(cell);
    }

    const row = (
      <View style={styles_.monthRows} key={`r${i}`}>
        {monthCells}
      </View>
    );

    monthRows.push(row);
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
              <Touchable
                onPress={() => {
                  /* Override parent, do nothing */
                }}>
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
  /**
   * Selected month, default value is current month
   */
  selected: PropTypes.instanceOf(Date),
  /**
   * Things to do when user select a month
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Background color of popup header
   */
  popupHeaderBgColor: PropTypes.string,
  /**
   * Font size, default value is 16
   */
  fontSize: PropTypes.number,
  /**
   * Background color of selected cell
   */
  selectedBgColor: PropTypes.string,
  /**
   * Foreground color of selected cell
   */
  selectedFgColor: PropTypes.string,
  /**
   * Background color of normal cell
   */
  bgColor: PropTypes.string,
  /**
   * Foreground color of normal cell
   */
  fgColor: PropTypes.string,
};

MonthPicker.defaultProps = {
  selected: new Date(),
  fontSize: 16,
  bgColor: '#fff',
  selectedBgColor: '#3187fe',
  selectedFgColor: '#fff',
  fgColor: '#333',
  popupHeaderBgColor: '#3187fe',
};

export { MonthPicker };
