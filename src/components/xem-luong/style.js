import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE, MARGIN, PADDING } = SPACINGS;

export const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: MARGIN * 2,
  },
  errorView: {
    alignItems: 'center',
    padding: PADDING * 2,
  },
  header: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE * 1.2,
    fontWeight: 'bold',
    marginTop: MARGIN * 2,
    paddingHorizontal: PADDING * 4,
    paddingVertical: PADDING * 2,
  },
  thang: {
    color: COLORS.DARK,
    flex: 1,
    fontSize: FONT_SIZE,
    marginLeft: MARGIN * 4,
  },
  tien: {
    color: COLORS.DARK,
    flex: 1,
    fontSize: FONT_SIZE,
    marginRight: MARGIN * 2,
    textAlign: 'right',
  },
  loadedView: {
    margin: MARGIN,
  },
  item: {
    flexDirection: 'row',
    padding: PADDING * 2,
  },
  buttonText: {
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE,
    marginRight: 10,
  },
});
