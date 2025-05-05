import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE, MARGIN } = SPACINGS;

export const styles = StyleSheet.create({
  content: {
    borderBottomColor: COLORS.BORDER,
    borderBottomWidth: 1,
    color: COLORS.DARK,
    fontSize: FONT_SIZE,
  },
  wrapper: {
    margin: MARGIN,
  },
  headerRightWrapper: {
    marginRight: 20,
  },
});
