import axios from 'axios';
import {API_URLS} from '../assets/api-urls';

const baocaocong = axios.create({
  baseURL: API_URLS.SERVICES,
});

export const loadData = async (token, code, user06, myear, func) => {
  try {
    console.log('token', token);
    console.log('user06', user06);
    console.log('code', code);
    console.log('myear', myear);
    console.log('func', func);
    const response = await baocaocong.post(
      constants.API_URLS.SERVICES,
      {code, user06, myear, func},
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    //console.log(response.data);
    if (response.data) {
      return {success: true, data: response.data};
    } else {
      return {success: false, message: 'No data found'};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export const loadData1 = async (token, code, user06, myear, func) => {
  try {
    const response = await baocaocong.post(
      constants.API_URLS.SERVICES,
      {code, user06, myear, func},
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    //console.log(response.data);
    if (response.data) {
      return {success: true, data: response.data};
    } else {
      return {success: false, message: 'No data found'};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export const loadData2 = async (token, code, user06, myear, func) => {
  try {
    const response = await baocaocong.post(
      constants.API_URLS.SERVICES,
      {code, user06, myear, func},
      {
        headers: {
          token: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    //console.log(response.data);
    if (response.data) {
      return {success: true, data: response.data};
    } else {
      return {success: false, message: 'No data found'};
    }
  } catch (error) {
    return {success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại'};
  }
};

export default baocaocong;
