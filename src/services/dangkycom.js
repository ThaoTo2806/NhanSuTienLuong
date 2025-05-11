import axios from 'axios';
import {API_URLS} from '../assets/api-urls';

const dangkycom = axios.create({
  baseURL: API_URLS.SERVICES1,
});

export const loadData = async (token, code, user06, myear, month, func) => {
  try {
    const response = await dangkycom.post(
      '/',
      {code, func, user06, month, myear},
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data.data) {
      return {success: true, data: response.data.data};
    } else {
      return {success: false, message: 'No data found'};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export const loadData1 = async (
  token,
  code,
  user06,
  myear,
  month,
  day,
  func,
) => {
  //console.log('ngay: ', day);
  try {
    const response = await dangkycom.post(
      '/',
      {code, func, user06, month, day, myear},
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    //console.log('response', response);
    if (response.data.data) {
      return {success: true, data: response.data.data};
    } else {
      return {success: false, message: 'No data found'};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export const insertData = async (
  token,
  code,
  user06,
  func,
  selectedNoiAn,
  selectedDates,
  selectedLan,
  selectedMons,
  selectedBuois,
) => {
  console.log('selectedNoiAn:', selectedNoiAn);
  console.log('selectedDates:', selectedDates);
  console.log('selectedLan:', selectedLan);
  console.log('selectedMons:', selectedMons);
  console.log('selectedBuois:', selectedBuois);
  try {
    const response = await dangkycom.post(
      '/',
      {
        code,
        user06,
        func,
        selectedNoiAn,
        selectedDates,
        selectedLan,
        selectedMons,
        selectedBuois,
      },
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('response', response.data.success);
    if (response.data.success) {
      return {success: true, message: 'Đăng ký cơm thành công'};
    } else {
      return {success: false, message: response.error};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export default dangkycom;
