import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';

const TheoCa = ({data}) => {
  // Nhóm theo tháng-năm
  const grouped = data.reduce((acc, item) => {
    const key = item.lv004_thang_nam;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const renderHeader = () => (
    <View>
      {/* Hàng tiêu đề 1 */}
      <View style={styles.row}>
        <Text style={[styles.cell1, {height: 40}]}>STT</Text>
        <Text style={[styles.cell1, {height: 40}]}>Mã CC</Text>
        <Text style={[styles.cell1, {height: 40}]}>Phòng ban</Text>
        <Text style={[styles.cell1, {height: 40}]}>Mã nhân viên</Text>
        <Text style={[styles.cell1, {height: 40}]}>Tên nhân viên</Text>
        {Array.from({length: 31}, (_, i) => (
          <Text style={[styles.cell1, {height: 40}]} key={i + 1}>
            {i + 1}
          </Text>
        ))}
        <Text style={[styles.cell1, {height: 40}]}>Ngày làm</Text>
        <Text style={[styles.cell1, {height: 40}]}>VR</Text>
        <Text style={[styles.cell1, {width: 120}]}>Hàng tháng</Text>
        <Text style={[styles.cell1, {width: 180}]}>Phép</Text>
        <Text style={[styles.cell1, {width: 480}]}>
          Ngày nghỉ theo chế độ BH
        </Text>
        <Text style={[styles.cell1, {width: 240}]}>Tăng ca</Text>
        <Text style={[styles.cell1, {width: 240}]}>Phép năm</Text>
        <Text style={[styles.cell1, {height: 40}]}>Tổng ngày làm</Text>
      </View>

      {/* Hàng tiêu đề 2 (gộp các ô STT, Mã CC...) */}
      <View style={styles.row}>
        <Text style={[styles.cell1, {height: 20, width: 60}]} />
        <Text style={[styles.cell1, {height: 20, width: 60}]} />
        <Text style={[styles.cell1, {height: 20, width: 60}]} />
        <Text style={[styles.cell1, {height: 20, width: 60}]} />
        <Text style={[styles.cell1, {height: 20, width: 60}]} />
        {[...Array(31)].map((_, i) => (
          <Text style={[styles.cell1, {height: 20}]} key={i + 1} />
        ))}
        <Text style={[styles.cell1, {height: 20}]} />
        <Text style={[styles.cell1, {height: 20}]} />
        <Text style={styles.cell1}>L</Text>
        <Text style={styles.cell1}>P</Text>
        <Text style={styles.cell1}>PT</Text>
        <Text style={styles.cell1}>PB</Text>
        <Text style={styles.cell1}>KH</Text>
        {['TN', 'DS', 'CO', 'TT', 'VS', 'KT', 'HS', 'TS'].map(code => (
          <Text style={styles.cell1} key={code}>
            {code}
          </Text>
        ))}
        {['150%', 'CN', 'Lễ', 'Tổng'].map(tc => (
          <Text style={styles.cell1} key={tc}>
            TC {tc}
          </Text>
        ))}
        {['Đầu kỳ', 'Năm', 'Tháng', 'Cuối kỳ'].map(pn => (
          <Text style={styles.cell1} key={pn}>
            P {pn}
          </Text>
        ))}
        <Text style={[styles.cell1, {height: 20}]} />
      </View>
    </View>
  );

  const renderRows = () => {
    let stt = 1;
    return Object.entries(grouped).map(([month, records]) => {
      const employee = normalizeEmployee(records[0]); // lấy thông tin chung
      const dayMap = {};
      records.forEach(r => {
        dayMap[parseInt(r.lv004_ngay)] = r.lv015;
      });

      return (
        <View style={styles.row} key={month + employee.lv002}>
          <Text style={styles.cell}>{employee.lv004_thang_nam}</Text>
          <Text style={styles.cell}>{employee.lv002}</Text>
          <Text style={styles.cell}>{employee.lv062}</Text>
          <Text style={styles.cell}>{employee.lv002}</Text>
          <Text style={styles.cell}>{employee.ten}</Text>
          {Array.from({length: 31}, (_, i) => (
            <Text style={styles.cell} key={`day${i + 1}`}>
              {dayMap[i + 1] || ''}
            </Text>
          ))}

          {/* Các cột sau 31 ngày */}
          <Text style={styles.cell}>{employee.ngay_lam}</Text>
          <Text style={styles.cell}>{employee.vr}</Text>

          <Text style={styles.cell}>{employee.ht_l}</Text>
          <Text style={styles.cell}>{employee.ht_p}</Text>

          <Text style={styles.cell}>{employee.pt}</Text>
          <Text style={styles.cell}>{employee.pb}</Text>
          <Text style={styles.cell}>{employee.kh}</Text>

          {['tn', 'ds', 'co', 'tt', 'vs', 'kt', 'hs', 'ts'].map(key => (
            <Text style={styles.cell} key={key}>
              {employee[key]}
            </Text>
          ))}

          {['tc150', 'tccn', 'tcle', 'tctong'].map(key => (
            <Text style={styles.cell} key={key}>
              {employee[key]}
            </Text>
          ))}

          {['pn_dk', 'pn_nam', 'pn_thang', 'pn_ck'].map(key => (
            <Text style={styles.cell} key={key}>
              {employee[key]}
            </Text>
          ))}

          <Text style={styles.cell}>{employee.tong_ngay_lam}</Text>
        </View>
      );
    });
  };

  const normalizeEmployee = emp => ({
    ...emp,
    ngay_lam: emp.ngay_lam || '',
    vr: emp.vr || '',
    ht_l: emp.ht_l || '',
    ht_p: emp.ht_p || '',
    pt: emp.pt || '',
    pb: emp.pb || '',
    kh: emp.kh || '',
    tn: emp.tn || '',
    ds: emp.ds || '',
    co: emp.co || '',
    tt: emp.tt || '',
    vs: emp.vs || '',
    kt: emp.kt || '',
    hs: emp.hs || '',
    ts: emp.ts || '',
    tc150: emp.tc150 || '',
    tccn: emp.tccn || '',
    tcle: emp.tcle || '',
    tctong: emp.tctong || '',
    pn_dk: emp.pn_dk || '',
    pn_nam: emp.pn_nam || '',
    pn_thang: emp.pn_thang || '',
    pn_ck: emp.pn_ck || '',
    tong_ngay_lam: emp.tong_ngay_lam || '',
  });

  return (
    <ScrollView horizontal>
      <View>
        {renderHeader()}
        <ScrollView>{renderRows()}</ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    width: 60,
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#eee',
    textAlign: 'center',
    fontSize: 12,
    color: '#1f3d7a',
  },
  cell1: {
    width: 60,
    padding: 4,
    borderRightWidth: 1,
    borderColor: '#eee',
    textAlign: 'center',
    fontSize: 12,
    color: '#1f3d7a',
    fontWeight: 'bold',
  },
});

export default TheoCa;
