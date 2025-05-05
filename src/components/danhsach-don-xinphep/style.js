import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE, MARGIN, PADDING } = SPACINGS;

export const styles = StyleSheet.create({
  accordionTitle: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE,
    paddingVertical: PADDING,
  },
  screenWrapper: {
    margin: MARGIN,
  },
  headerWrapper: {
    backgroundColor: COLORS.LIGHT,
    flexDirection: 'row',
  },
  headerIconWrapper: {
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingTop: PADDING,
    width: FONT_SIZE * 2,
  },
  groupWrapper: {
    marginBottom: MARGIN,
    padding: PADDING,
  },
});
