import moment from "moment";
import { cashTypes, currencyCode, userTypes } from "../enums/index.js";
import { getUniqueItems } from "../utils/index.js";

/**
 * Add sort per transaction
 */
const addSortProp = (data) => {
  return data.map((d, index) => ({
    ...d,
    sort: index,
  }));
};

/**
 * Add week number per transaction
 */

const addWeekNumber = (data) => {
  return data.map((d) => ({
    ...d,
    week: moment(d.date, "YYYY-MM-DD").isoWeek(),
  }));
};

const filterSupportedCurrency = (data, currency) => {
  return data.filter(({ operation }) => operation.currency === currency);
};

/**
 * Return object:
    cashIn: Array,
    cashOut: Object {
      natural: Array
      juridical:
    },
 */

const prepareCashInCashOut = (data) => {
  const cashIn = data.filter((i) => i.type === cashTypes.CASH_IN); // Filter by cash-in type
  const cashOut = data.filter((i) => i.type === cashTypes.CASH_OUT); // Filter by cash-out type
  const natural = cashOut.filter((i) => i.user_type === userTypes.NATURAL); // Filter Cash Out - Natural
  const juridical = cashOut.filter((i) => i.user_type === userTypes.JURIDICAL); // Filter Cash Out - Juridical

  return {
    cashIn,
    cashOut: {
      natural,
      juridical,
    },
  };
};

/**
 * Return object:
    key: userId
    value: Object {
      cashIn: Array,
      cashOut: Array
    }
 */

export const preparedTransactions = (data) => {
  const userIds = getUniqueItems(data, "user_id"); // Return array of unique user ids
  const preparedTransactionData = filterSupportedCurrency(
    addWeekNumber(addSortProp(data)),
    currencyCode.EUR
  ); // data with additional props: week, sort and filter by EUR

  return userIds.reduce((acc, cur) => {
    const userData = preparedTransactionData.filter((i) => i.user_id === cur);
    acc[cur] = prepareCashInCashOut(userData);
    return acc;
  }, {});
};
