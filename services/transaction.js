import moment from "moment";
import { cashTypes } from "../enums/index.js";
import { getUniqueValues } from "../utils/index.js";
const addSortProp = (data) => {
  return data.map((d, index) => ({
    ...d,
    sort: index,
  }));
};

const addWeekNumber = (data) => {
  return data.map((d) => ({
    ...d,
    weekNo: moment(d.date, "YYYY-MM-DD").isoWeek(),
  }));
};

const filterByCashType = (data, type) => {
  return data.filter((i) => i.type === type);
};

// Return object
// key: user-id
// value: cash-in/out array
export const preparedTransactions = (data) => {
  // Return array of unique user ids
  const userIds = getUniqueValues(data, "user_id");
  const preparedData = addWeekNumber(addSortProp(data));
  return userIds.reduce((acc, cur) => {
    const userData = preparedData.filter((i) => i.user_id === cur);
    acc[cur] = {
      cashIn: filterByCashType(userData, cashTypes.CASH_IN),
      cashOut: filterByCashType(userData, cashTypes.CASH_OUT),
    };
    return acc;
  }, {});
};
