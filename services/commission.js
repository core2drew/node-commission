import { userTypes } from "../enums/index.js";
import { getCashInConfig, getCashOutConfig } from "../api/config.js";
import { getUniqueItems } from "../utils/index.js";

const computeCommissionFee = (percent, amount) => {
  return ((percent * amount) / 100).toFixed(2);
};

export const getCashInCommissionFee = (data, config) => {
  const { percents, max } = config;
  const { amount: maxCommissionFee } = max;
  return data.map(({ operation, sort }) => {
    const { amount } = operation;
    const commissionFee = Math.min(
      computeCommissionFee(percents, amount),
      maxCommissionFee
    ).toFixed(2);
    return {
      sort,
      commissionFee,
    };
  });
};

export const getCashOutNaturalCommissionFee = (data, config) => {
  // Get array of unique weeks
  const transactionWeek = getUniqueItems(data, "week");
  const { percents, week_limit } = config;
  const { amount: week_limit_amount } = week_limit;

  return transactionWeek.reduce((acc, cur) => {
    let totalCashOut = 0;
    let isExceeding = false;

    const filteredWeek = data.filter((i) => i.week === cur); // Filter data base on current week

    const commission = filteredWeek.map(({ sort, operation }) => {
      const { amount } = operation;
      totalCashOut += amount;
      if (!isExceeding) {
        isExceeding = totalCashOut > week_limit_amount;
        if (isExceeding) {
          const exceedingAmount = totalCashOut - week_limit_amount;
          return {
            sort,
            commissionFee: computeCommissionFee(percents, exceedingAmount),
          };
        }
        return {
          sort,
          commissionFee: Number(0).toFixed(2),
        };
      }
      return {
        sort,
        commissionFee: computeCommissionFee(percents, amount),
      };
    });
    return [...acc, ...commission];
  }, []);
};

export const getCashOutJuridicalCommissionFee = (data, config) => {
  const { percents, min } = config;
  const { amount: minAmount } = min;

  return data.map(({ sort, operation }) => {
    const { amount } = operation;
    const commissionFee = Math.max(
      computeCommissionFee(percents, amount),
      minAmount
    ).toFixed(2);
    return {
      sort,
      commissionFee,
    };
  });
};

export const getCommissionFee = async (data) => {
  // Fetch configs
  const cashInConfig = await getCashInConfig();
  const cashOutNaturalConfig = await getCashOutConfig(userTypes.NATURAL);
  const cashOutJuridicalConfig = await getCashOutConfig(userTypes.JURIDICAL);
  // Get data keys
  const userIds = Object.keys(data);

  const commissionFee = userIds.reduce((acc, cur) => {
    const { cashIn, cashOut } = data[cur];
    const { natural, juridical } = cashOut;

    const cashInCommissionFee = getCashInCommissionFee(cashIn, cashInConfig);
    const cashOutCommissionFeeNatural = getCashOutNaturalCommissionFee(
      natural,
      cashOutNaturalConfig
    );
    const cashOutCommissionFeeJuridical = getCashOutJuridicalCommissionFee(
      juridical,
      cashOutJuridicalConfig
    );

    return [
      ...acc,
      ...cashInCommissionFee,
      ...cashOutCommissionFeeNatural,
      ...cashOutCommissionFeeJuridical,
    ];
  }, []);

  const sorted = [...commissionFee].sort((a, b) => a.sort - b.sort); // Sort by commissionFee sort property
  return sorted.map((d) => {
    return d.commissionFee;
  });
};
