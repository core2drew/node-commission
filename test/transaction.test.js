import chai from "chai";
import { preparedTransactions } from "../services/transaction.js";

const data = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
  },
];

const transactionData = [
  {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: { amount: 200.0, currency: "EUR" },
    week: 1,
    sort: 0,
  },
];

describe("#preparedTransactions()", function () {
  context("passing valid data", function () {
    it("should return transaction data", function () {
      chai.expect(() => {
        preparedTransactions({ data }).to.deep.equal(transactionData);
      });
    });
  });

  context("passing empty array", function () {
    it("should throw error", function () {
      chai
        .expect(() => {
          preparedTransactions({ data: [] });
        })
        .to.throw(Error, "Data expect not empty array.");
    });
  });

  context("passing non-array", function () {
    it("should throw error", function () {
      chai
        .expect(() => {
          preparedTransactions({ data: {} });
        })
        .to.throw(Error, "Data expect to be array.");
    });
  });

  context("passing array object without user_id property", function () {
    it("should throw error", function () {
      chai
        .expect(() => {
          preparedTransactions({
            data: [
              {
                date: "2016-01-05",
                user_type: "natural",
                type: "cash_in",
                operation: { amount: 200.0, currency: "EUR" },
              },
            ],
          });
        })
        .to.throw(Error, "Data expect user_id property.");
    });
  });
});
