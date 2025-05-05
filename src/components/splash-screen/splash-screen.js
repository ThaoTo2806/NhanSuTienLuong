import React from 'react';
import { Image, View } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../assets/colors';
import { SPACINGS } from '../../assets/spacings';
import { styles } from './style';

const { GRADIENT } = COLORS;
const { FONT_SIZE } = SPACINGS;

export const SplashScreen = () => {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[GRADIENT.FIRST, GRADIENT.SECOND]}
        style={styles.gradient}
      />
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          source={require('../../assets/images/sof.png')}
        />
        <ProgressBar
          color={COLORS.PRIMARY}
          height={FONT_SIZE}
          indeterminate={true}
          useNativeDriver={true}
          width={200}
        />
      </View>
    </View>
  );
};
