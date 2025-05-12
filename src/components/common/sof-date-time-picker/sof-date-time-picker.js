import React, { useEffect, useRef, useState } from 'react';
import { Modal, Platform, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { styles } from './style';

const SofDateTimePicker = ({ color, fontSize, onChange, initialValue }) => {
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [androidSelectedDate, setAndroidSelectedDate] = useState(null);
  const [value, setValue] = useState(initialValue);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const formatDate_ = dateValue =>
    dayjs(dateValue)
      .locale('vi')
      .format('dd - DD/MM/YY - HH:mm');

  const dateChanged_ = (e, selectedDate) => {
    if (e.type === 'set') {
      if (showDate) {
        // Android only
        if (mounted.current) {
          setAndroidSelectedDate(selectedDate);
          setShowDate(false);
          setShowTime(true);
        }
      } else {
        // iOS or Android time
        let date = selectedDate;

        if (showTime) {
          // Android time
          date = androidSelectedDate;
          date.setHours(selectedDate.getHours());
          date.setMinutes(selectedDate.getMinutes());
        }

        if (mounted.current) {
          setShow(false);
          setValue(date);
          setShowTime(false);
          setAndroidSelectedDate(null);
        }

        onChange(date);
      }
    } else {
      if (mounted.current) {
        setShow(false);
        setShowDate(false);
        setShowTime(false);
        setAndroidSelectedDate(null);
      }
    }
  };

  return (
    <View style={styles.dateWrapper}>
      <Text
        selectable={false}
        onPress={() => {
          if (mounted.current) {
            setShow(true);
            setShowDate(Platform.OS === 'android');
            setShowTime(false);
            setAndroidSelectedDate(null);
          }
        }}
        style={{ color, fontSize }}>
        {formatDate_(value)}
      </Text>
      {show && Platform.OS === 'android' && showDate && (
        <DateTimePicker value={value} mode="date" onChange={dateChanged_} />
      )}
      {show && Platform.OS === 'android' && showTime && (
        <DateTimePicker
          value={value}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={dateChanged_}
        />
      )}
      {show && Platform.OS === 'ios' && (
        <Modal
          visible={true}
          onRequestClose={() => {
            if (mounted.current) {
              setShow(false);
              setShowDate(false);
              setShowTime(false);
              setAndroidSelectedDate(null);
            }
          }}
          animationType="fade"
          transparent={true}>
          <View style={styles.popupOverlay}>
            <View style={styles.popupContainer}>
              <DateTimePicker
                value={value}
                mode="datetime"
                onChange={dateChanged_}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

SofDateTimePicker.propTypes = {
  /**
   * Text color
   */
  color: PropTypes.string,

  /**
   * Font size
   */
  fontSize: PropTypes.number,

  /**
   * onChange
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Initial value
   */
  initialValue: PropTypes.instanceOf(Date),
};

SofDateTimePicker.defaultProps = {
  color: '#333',
  fontSize: 16,
  initialValue: new Date(),
};

export { SofDateTimePicker };
