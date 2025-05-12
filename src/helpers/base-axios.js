import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URLS } from '../assets/api-urls';
import { STORAGE_KEYS as KEYS } from '../assets/storage-keys';

function baseAxios(options) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.extraHeaders,
  };

  const baseUrl = API_URLS.SERVICES;

  return axios.create({
    baseURL: baseUrl,
    timeout: options.timeout || 30000,
    headers: defaultHeaders,
  });
}

async function executeRequest(method, pathname, data, options = {}) {
  let body;

  if (method === 'get' || !data) {
    body = {};
  } else {
    body = { data };
  }

  const userName = await AsyncStorage.getItem(KEYS.USERNAME);
  const code = await AsyncStorage.getItem(KEYS.CODE);
  const token = await AsyncStorage.getItem(KEYS.TOKEN);

  const reqObj = {
    url: pathname,
    method,
    params: {
      ...options.query,
      id: userName,
      code,
      token,
    },
    ...body,
  };

  const baseAxiosRequest = baseAxios(options);

  return new Promise((resolve, reject) => {
    return baseAxiosRequest
      .request(reqObj)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export const BaseAxios = {
  get(pathname, options) {
    return executeRequest('get', pathname, null, options);
  },

  post(pathname, data, options) {
    return executeRequest('post', pathname, data, options);
  },

  put(pathname, data, options) {
    return executeRequest('put', pathname, data, options);
  },

  delete(pathname, data, options) {
    return executeRequest('delete', pathname, data, options);
  },
};
