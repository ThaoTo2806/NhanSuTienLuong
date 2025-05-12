import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE, MARGIN, PADDING } = SPACINGS;

export const styles = StyleSheet.create({
  screenWrapper: {
    margin: MARGIN,
  },
  headerWrapper: {
    backgroundColor: COLORS.LIGHT,
    flex: 1,
    flexDirection: 'row',
    marginVertical: MARGIN,
  },
  headerIconWrapper: {
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingTop: PADDING,
    width: FONT_SIZE * 2,
  },
  headerLabelWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  headerLabel: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE,
  },
  headerLabelActive: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  staffName: {
    paddingTop: PADDING,
  },
  deparment: {
    paddingBottom: PADDING,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    marginBottom: MARGIN,
    padding: PADDING,
  },
  buttonText: {
    fontSize: FONT_SIZE,
    fontWeight: '500',
    marginRight: MARGIN,
  },
  groupWrapper: {
    marginBottom: MARGIN,
    padding: PADDING,
  },
  fullScreenLoading: {
    alignItems: 'center',
    backgroundColor: COLORS.DIM,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    opacity: 0.4,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  approveAllButton: {
    bottom: MARGIN * 2,
    position: 'absolute',
    right: MARGIN * 2,
  },
});
