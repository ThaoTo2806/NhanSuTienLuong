import { StyleSheet } from 'react-native';
import { SPACINGS } from './spacings';
import { COLORS } from './colors';

const { BORDER_RADIUS, FONT_SIZE, MARGIN, PADDING } = SPACINGS;

export const commonStyles = StyleSheet.create({
  content: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE,
  },
  formGroup: {
    backgroundColor: COLORS.LIGHT,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    margin: MARGIN,
    paddingHorizontal: PADDING * 2,
    paddingVertical: PADDING,
  },
  label: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE,
    marginBottom: MARGIN / 2,
  },
});
