import axios from 'axios';
import {API_URLS} from '../assets/api-urls';

const thongbao = axios.create({
  baseURL: API_URLS.SERVICES1,
});

export const loadData = async (token, code, func) => {
  try {
    const response = await thongbao.post(
      '/',
      {code, func},
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

export default thongbao;
