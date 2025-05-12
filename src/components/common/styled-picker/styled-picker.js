import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { styles } from './style';

const Touchable =
  Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

const StyledPicker = props => {
  const {
    color,
    enable,
    fontSize,
    items,
    onValueChange,
    textField,
    valueField,
  } = props;

  const mounted = useRef(true);

  // The popup is displayed or not
  const [displayPopup, setDisplayPopup] = useState(false);

  let firstText;

  if (items.length > 0) {
    if (valueField) {
      firstText = `${items[0][textField]}`;
    } else {
      firstText = `${items[0]}`;
    }
  } else {
    firstText = ' ';
  }

  // Text to display on the picker when an item is selected (selected text)
  const [text, setText] = useState(firstText);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <View style={styles.pickerContainer}>
      <Touchable
        disabled={!enable}
        onPress={() => {
          mounted.current && setDisplayPopup(true);
        }}>
        <View style={styles.dropDownContainer}>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {text}
          </Text>
          <View style={styles.arrow}>
            <Icon name="caret-down" size={fontSize} color={color} />
          </View>
        </View>
      </Touchable>
      {displayPopup && (
        <Modal
          visible={displayPopup}
          onRequestClose={() => {}}
          animationType="fade"
          transparent={true}>
          <Touchable
            onPress={() => {
              mounted.current && setDisplayPopup(false);
            }}>
            <View style={styles.popupOverlay}>
              <View style={styles.popupContainer}>
                <FlatList
                  data={items}
                  renderItem={({ item }) => (
                    <Text
                      key={valueField ? item[valueField] : item}
                      style={[
                        styles.pickerItem,
                        {
                          color,
                          fontSize,
                        },
                      ]}
                      onPress={() => {
                        if (mounted.current) {
                          setDisplayPopup(false);
                          setText(textField ? item[textField] : item);
                        }

                        onValueChange(valueField ? item[valueField] : item);
                      }}>
                      {textField ? item[textField] : item}
                    </Text>
                  )}
                  keyExtractor={(item, index) => `${index}`}
                />
              </View>
            </View>
          </Touchable>
        </Modal>
      )}
    </View>
  );
};

StyledPicker.propTypes = {
  /**
   * Enable/disable the picker
   */
  enable: PropTypes.bool.isRequired,
  /**
   * Picker items
   */
  items: PropTypes.array.isRequired,
  /**
   * Things to do when the value change
   */
  onValueChange: PropTypes.func.isRequired,
  /**
   * Item's field used to display on the picker
   */
  textField: PropTypes.string,
  /**
   * Item's field used as picker's value
   */
  valueField: PropTypes.string,
  /**
   * Font size
   */
  fontSize: PropTypes.number,
  /**
   * Text/icon color
   */
  color: PropTypes.string,
};

StyledPicker.defaultProps = {
  enable: true,
  items: [],
  fontSize: 16,
  color: '#333',
};

export { StyledPicker };
