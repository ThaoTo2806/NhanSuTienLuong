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
  gender: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE,
    marginLeft: MARGIN * 2,
  },
  loadedView: {
    margin: MARGIN,
  },
  name: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE * 1.5,
    fontWeight: 'bold',
    marginLeft: MARGIN * 2,
  },
  nameWrapper: {
    flexDirection: 'row',
    marginVertical: MARGIN * 2,
    padding: PADDING,
  },
  button: {
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE,
    marginRight: 10,
  },
});
