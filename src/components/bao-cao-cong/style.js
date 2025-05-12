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
    backgroundColor: COLORS.SECONDARY,
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE + 3,
    fontWeight: 'bold',
    marginTop: MARGIN * 2,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  thang: {
    color: COLORS.DARK,
    flex: 1,
    fontSize: FONT_SIZE,
    marginLeft: MARGIN * 2,
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
  name: {
    color: COLORS.DARK,
    fontSize: FONT_SIZE * 1.5,
    fontWeight: 'bold',
    paddingLeft: PADDING * 2,
  },
  nameWrapper: {
    flexDirection: 'row',
    marginVertical: MARGIN * 2,
    padding: PADDING,
  },
  item: {
    flexDirection: 'row',
    padding: PADDING,
  },
  rowStyle: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  buttonIcon: {
    marginLeft: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE,
    marginRight: 5,
  },
});
