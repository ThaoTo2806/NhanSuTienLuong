import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    right: 5,
  },
  dropDownContainer: {
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 25,
    paddingTop: 5,
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
  },
  pickerItem: {
    padding: 12,
  },
  popupContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 4,
    maxHeight: '80%',
    width: '80%',
  },
  popupOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(51, 51, 51, 0.7)',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
