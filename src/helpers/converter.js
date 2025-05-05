import dayjs from 'dayjs';

export const Converter = {
  // Định dạng số tiền
  numberToVnd(number) {
    if (isNaN(number)) {
      throw new Error('Invalid number');
    }

    const r = `${parseInt(number, 10)}`;

    return r.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  },

  // Chuyển chuỗi ngày từ dạng yyyy-mm-dd sang dạng dd/mm/yyyy
  ymdToDmy(dateString) {
    let date = dayjs(dateString);

    return date.isValid() ? date.format('DD/MM/YYYY') : '';
  },
};
