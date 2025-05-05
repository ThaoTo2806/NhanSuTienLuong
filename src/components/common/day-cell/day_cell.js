import React from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './style';

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const DayCell = props => {
  const {
    bgColor,
    fgColor,
    fontSize,
    todayBgColor,
    todayFgColor,
    onPress,
    today,
    day,
    text,
    width,
    textColor, // Add textColor prop
  } = props;

  const cellContainerStyle = [styles.cellContainer];
  const containerStyle = { backgroundColor: bgColor, width };
  const normalDayNumberStyle = [{ fontSize: fontSize - 2 }];
  const todayNumberStyle = [{ fontSize }];

  if (day) {
    cellContainerStyle.push({
      borderColor: '#dedfe0',
      borderRadius: 3,
    });
  } else {
    cellContainerStyle.push({ borderColor: bgColor });
  }

  if (today) {
    cellContainerStyle.push({ backgroundColor: todayBgColor });
    normalDayNumberStyle.push({ color: todayFgColor });
    todayNumberStyle.push({ color: todayFgColor });
  } else {
    cellContainerStyle.push({ backgroundColor: bgColor });
    normalDayNumberStyle.push({ color: todayBgColor });
    todayNumberStyle.push({ color: fgColor });
  }

  return (
    <Touchable
      onPress={() => {
        onPress(day);
      }}>
      <View style={containerStyle}>
        <View style={cellContainerStyle}>
          <Text style={[normalDayNumberStyle, { color: textColor }]}>{day}</Text> {/* Apply textColor */}
          <View style={styles.textContainer}>
            <Text style={[todayNumberStyle, { color: textColor }]}>{text}</Text> {/* Apply textColor */}
          </View>
        </View>
      </View>
    </Touchable>
  );
};

DayCell.propTypes = {
  today: PropTypes.bool,
  todayBgColor: PropTypes.string,
  todayFgColor: PropTypes.string,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  day: PropTypes.number,
  text: PropTypes.string,
  fontSize: PropTypes.number,
  width: PropTypes.number.isRequired,
  textColor: PropTypes.string, // Add textColor prop type
};

DayCell.defaultProps = {
  today: false,
  bgColor: '#fff',
  todayBgColor: '#3187fe',
  fontSize: 16,
  todayFgColor: '#fff',
  fgColor: '#333',
  textColor: '#333', // Default text color
};

export { DayCell };