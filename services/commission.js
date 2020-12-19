import { userTypes } from "../enums/index.js";
import { getCashInConfig, getCashOutConfig } from "../api/config.js";
import { getUniqueValues } from "../utils/index.js";

const computeCommission = (percent, amount) => {
  return ((percent * amount) / 100).toFixed(2);
};

const getCashInCommissionFee = (data, config) => {
  const { percents, max } = config;
  const { amount: maxCommissionFee } = max;
  return data.map(({ operation, sort }) => {
    const { amount } = operation;
    const commissionFee = Math.min(
      computeCommission(percents, amount),
      maxCommissionFee
    ).toFixed(2);
    return {
      sort,
      commissionFee,
    };
  });
};

const getCashOutNaturalCommissionFee = (data, cashOutNaturalConfig) => {
  const transactionWeekNos = getUniqueValues(data, "weekNo");
  const { percents, week_limit } = cashOutNaturalConfig;
  const { amount: week_limit_amount } = week_limit;

  return transactionWeekNos.reduce((acc, cur) => {
    let totalCashOut = 0;
    let isExceeding = false;
    const filteredWeek = data.filter((i) => i.weekNo === cur);
    const commission = filteredWeek.map(({ sort, operation }) => {
      const { amount } = operation;
      totalCashOut += amount;
      if (!isExceeding) {
        isExceeding = totalCashOut > week_limit_amount;
        if (isExceeding) {
          const amt = totalCashOut - week_limit_amount;
          return {
            sort,
            commissionFee: computeCommission(percents, amt),
          };
        }
        return {
          sort,
          commissionFee: Number(0).toFixed(2),
        };
      }
      return {
        sort,
        commissionFee: computeCommission(percents, amount),
      };
    });
    return [...acc, ...commission];
  }, []);
};

const getCashOutJuridicalCommissionFee = (data, cashOutJuridicalConfig) => {
  const { percents, min } = cashOutJuridicalConfig;
  const { amount: minAmount } = min;

  return data.map(({ sort, operation }) => {
    const { amount } = operation;
    const commissionFee = Math.max(
      computeCommission(percents, amount),
      minAmount
    ).toFixed(2);
    return {
      sort,
      commissionFee,
    };
  });
};

export const computeCommissionFee = async (data) => {
  const cashInConfig = await getCashInConfig();
  const cashOutNaturalConfig = await getCashOutConfig(userTypes.NATURAL);
  const cashOutJuridicalConfig = await getCashOutConfig(userTypes.JURIDICAL);

  const commissionFee = Object.keys(data).reduce((acc, cur) => {
    const { cashIn, cashOut } = data[cur];
    const cashOutNaturalData = cashOut.filter(
      ({ user_type }) => user_type === userTypes.NATURAL
    );
    const cashOutJuridicalData = cashOut.filter(
      ({ user_type }) => user_type === userTypes.JURIDICAL
    );

    const cashInCommissionFee = getCashInCommissionFee(cashIn, cashInConfig);
    const cashOutCommissionFeeNatural = getCashOutNaturalCommissionFee(
      cashOutNaturalData,
      cashOutNaturalConfig
    );
    const cashOutCommissionFeeJuridical = getCashOutJuridicalCommissionFee(
      cashOutJuridicalData,
      cashOutJuridicalConfig
    );

    return [
      ...acc,
      ...cashInCommissionFee,
      ...cashOutCommissionFeeNatural,
      ...cashOutCommissionFeeJuridical,
    ];
  }, []);
  const sorted = [...commissionFee].sort((a, b) => a.sort - b.sort);
  return sorted.map((d) => {
    return d.commissionFee;
  });
};
