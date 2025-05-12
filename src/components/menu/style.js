import {StyleSheet} from 'react-native';
import {COLORS} from '../../assets/colors';
import {SPACINGS} from '../../assets/spacings';

const {FONT_SIZE, MARGIN, PADDING} = SPACINGS;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  wrapper: {
    alignItems: 'center',
    flexGrow: 1,
    padding: PADDING * 2,
  },
  logo: {
    marginVertical: 20,
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  button: {
    marginBottom: MARGIN * 3,
    maxWidth: 350,
    minWidth: 240,
    width: '80%',
  },
  icon: {
    marginLeft: MARGIN * 2,
  },
  text: {
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE,
    fontWeight: '500',
  },
});
