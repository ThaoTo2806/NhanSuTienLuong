import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './style';

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const MonthCell = props => {
  const {
    fgColor,
    bgColor,
    selectedBgColor,
    fontSize,
    label,
    month,
    onPress,
    selected,
    selectedFgColor,
    size,
  } = props;

  const styles_ = StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
    defaultCell: {
      backgroundColor: bgColor,
      height: size,
      padding: 8,
      width: size,
    },
    normalCell: {
      backgroundColor: bgColor,
      height: size - 8,
      width: size - 8,
    },
    defaultLabel: {
      fontSize,
      color: fgColor,
    },
    selectedCell: {
      backgroundColor: selectedBgColor,
      borderRadius: (size - 8) / 2,
      height: size - 8,
      width: size - 8,
    },
    selectedLabel: {
      fontSize,
      color: selectedFgColor,
    },
  });

  const {
    container,
    selectedCell,
    normalCell,
    defaultCell,
    selectedLabel,
    defaultLabel,
  } = styles_;

  return (
    <Touchable
      onPress={() => {
        onPress(month);
      }}>
      <View style={container}>
        <View style={[styles.cell, defaultCell]}>
          <View style={[styles.cell, selected ? selectedCell : normalCell]}>
            <Text style={selected ? selectedLabel : defaultLabel}>{label}</Text>
          </View>
        </View>
      </View>
    </Touchable>
  );
};

MonthCell.propTypes = {
  /**
   * Indicates this month cell is selected
   */
  selected: PropTypes.bool,
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
  /**
   * Cell's text
   */
  label: PropTypes.string.isRequired,
  /**
   * Action performed when cell pressed
   */
  onPress: PropTypes.func.isRequired,
  /**
   * Month's value
   */
  month: PropTypes.number.isRequired,
  /**
   * Font size
   */
  fontSize: PropTypes.number,
  /**
   * Cell size: width and height
   */
  size: PropTypes.number.isRequired,
};

MonthCell.defaultProps = {
  selected: false,
  bgColor: '#fff',
  selectedBgColor: '#3187fe',
  fontSize: 16,
  selectedFgColor: '#fff',
  fgColor: '#333',
};

export { MonthCell };
