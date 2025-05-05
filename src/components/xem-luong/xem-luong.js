import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, Text, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../assets/colors';
import { commonStyles } from '../../assets/common-styles';
import { MESSAGES } from '../../assets/messages';
import { SPACINGS } from '../../assets/spacings';
import { Converter } from '../../helpers/converter';
import { LangContext } from '../common/contexts';
import { styles } from './style';
import { BaseAxios } from '../../helpers/base-axios';
import { MonthPicker } from '../common/month-picker/month-picker';

const { formGroup, label, content: contentStyle } = commonStyles;
const { BORDER_RADIUS, FONT_SIZE, MARGIN } = SPACINGS;

export const XemLuong = () => {
  const { lang } = useContext(LangContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [thang, setThang] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const layBangLuong_ = async () => {
      setLoading(true);

      try {
        const query = {
          table: 'tc_lv0020',
          func: 'data',
          month: thang,
          year: nam,
        };

        const json = await BaseAxios.get('/', { query });

        const arr = json.data.map(d => ({
          key: d.lv004,
          nam: d.lv004.substr(0, 4) * 1,
          thang: d.lv004.substr(5, 2) * 1,
          tienLuong: Converter.numberToVnd(d.lv050),
        }));

        const namArr = arr.map(d => d.nam);
        const namDau = Math.min(...namArr);
        const namCuoi = Math.max(...namArr);
        const newData = [];

        for (let i = namCuoi; i >= namDau; i--) {
          const sectionData = arr.filter(d => d.nam === i);

          sectionData.sort((d1, d2) => d2.thang - d1.thang);

          newData.push({
            title: `Năm ${i}`,
            data: sectionData,
          });
        }

        setData(newData);
        setError(false);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
        Alert.alert(
          MESSAGES[lang].LOI_LIET_KE_LUONG,
          'Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại.',
          [{ text: 'OK' }]
        );
        console.error('Error fetching data: ', err); 
      }
    };

    layBangLuong_();
  }, [nam, thang]);

  const renderItem_ = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.thang}>Tháng {item.thang}</Text>
      <Text style={styles.tien}>{item.tienLuong}</Text>
    </View>
  );

  const renderSectionHeader_ = ({ section: { title } }) => (
    <Text style={styles.header}>{title}</Text>
  );

  return (
    <View>
      <View style={commonStyles.formGroup}>
        <Text style={label}>Tháng</Text>
        <MonthPicker
          fontSize={FONT_SIZE}
          onChange={(m, y) => {
            setThang(m);
            setNam(y);
          }}
          style={contentStyle}
        />
      </View>

      {loading && (
        <ActivityIndicator
          animating={true}
          size="large"
          color="#40adf5"
          style={{ marginTop: MARGIN * 2 }}
        />
      )}

      {!loading && error && (
        <View style={styles.errorView}>
          <Text style={commonStyles.content}>
            {MESSAGES[lang].LOI_LIET_KE_LUONG}
          </Text>
          <View style={styles.buttonContainer}>
            <Icon.Button
              name="refresh"
              backgroundColor={COLORS.PRIMARY}
              borderRadius={BORDER_RADIUS}
              onPress={() => {
                layBangLuong_();
              }}
              size={FONT_SIZE}
              color={COLORS.LIGHT}>
              <Text style={styles.buttonText}>Thử lại</Text>
            </Icon.Button>
          </View>
        </View>
      )}

      {!loading && !error && (
        <SectionList
          contentContainerStyle={styles.loadedView}
          renderItem={renderItem_}
          renderSectionHeader={renderSectionHeader_}
          sections={data}
        />
      )}
    </View>
  );
};
