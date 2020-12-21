export const cashIn = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
    sort: 0,
    week: 1,
  },
];

export const cashOutNatural = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 200.0, currency: "EUR" },
    sort: 0,
    week: 1,
  },
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_out",
    operation: { amount: 1000, currency: "EUR" },
    sort: 1,
    week: 1,
  },
];

export const cashOutJuridical = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 100.0, currency: "EUR" },
    sort: 0,
    week: 1,
  },
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 1000, currency: "EUR" },
    sort: 1,
    week: 1,
  },
];
