import { StyleSheet } from 'react-native';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';

const { FONT_SIZE } = SPACINGS;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  innerWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  textBox: {
    width: 400,
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    marginLeft: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: COLORS.LIGHT,
    fontSize: FONT_SIZE,
    marginRight: 10,
  },
  marginTop: {
    marginTop: 10,
  },
  notifyText: {
    color: '#0c4408',
    fontSize: FONT_SIZE,
  },
});
