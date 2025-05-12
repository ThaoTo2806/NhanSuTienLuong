import React from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {styles} from './style';

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const DayCell = ({
  bgColor = '#fff',
  fgColor = '#333',
  fontSize = 16,
  todayBgColor = '#3187fe',
  todayFgColor = '#fff',
  onPress,
  today = false,
  day,
  text,
  width,
  textColor = '#333',
}) => {
  const cellContainerStyle = [styles.cellContainer];
  const containerStyle = {backgroundColor: bgColor, width};
  const normalDayNumberStyle = [{fontSize: fontSize - 2}];
  const todayNumberStyle = [{fontSize}];

  if (day) {
    cellContainerStyle.push({
      borderColor: '#dedfe0',
      borderRadius: 3,
    });
  } else {
    cellContainerStyle.push({borderColor: bgColor});
  }

  if (today) {
    cellContainerStyle.push({backgroundColor: todayBgColor});
    normalDayNumberStyle.push({color: todayFgColor});
    todayNumberStyle.push({color: todayFgColor});
  } else {
    cellContainerStyle.push({backgroundColor: bgColor});
    normalDayNumberStyle.push({color: todayBgColor});
    todayNumberStyle.push({color: fgColor});
  }

  return (
    <Touchable onPress={() => onPress?.(day)}>
      <View style={containerStyle}>
        <View style={cellContainerStyle}>
          <Text style={[...normalDayNumberStyle, {color: textColor}]}>
            {typeof day === 'number' || typeof day === 'string' ? day : ''}
          </Text>
          <View style={styles.textContainer}>
            <Text style={[...todayNumberStyle, {color: textColor}]}>
              {typeof text === 'string' ? text : ''}
            </Text>
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
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  text: PropTypes.string,
  fontSize: PropTypes.number,
  width: PropTypes.number.isRequired,
  textColor: PropTypes.string,
};

export {DayCell};
