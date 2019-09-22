import moment from 'moment';

const fmtDate = (v, fmt = 'YYYY-MM-DD') => {
  if (v == null) return v;
  return moment(v).format(fmt);
};

export default fmtDate;
