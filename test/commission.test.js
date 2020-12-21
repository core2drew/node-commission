import chai from "chai";
import {
  getCashInCommissionFee,
  getCashOutNaturalCommissionFee,
  getCashOutJuridicalCommissionFee,
} from "../services/commission.js";
import {
  cashIn,
  cashOutNatural,
  cashOutJuridical,
} from "./data/commission-test.data.js";

describe("#getCashInCommissionFee()", function () {
  context("passing valid data", function () {
    it("should return cash in data", function () {
      chai.should(() => {
        getCashInCommissionFee(cashIn).to.deep.equal([
          {
            sort: 0,
            amount: "0.06",
          },
        ]);
      });
    });
  });
});

describe("#getCashOutNaturalCommissionFee()", function () {
  context("passing valid data", function () {
    it("should return cash out natural data", function () {
      chai.should(() => {
        getCashOutNaturalCommissionFee(cashOutNatural).to.deep.equal([
          {
            sort: 0,
            amount: "0.00",
          },
          {
            sort: 1,
            amount: "0.60",
          },
        ]);
      });
    });
  });
});

describe("#getCashOutJuridicalCommissionFee()", function () {
  context("passing valid data", function () {
    it("should return cash out juridical data", function () {
      chai.should(() => {
        getCashOutJuridicalCommissionFee(cashOutJuridical).to.deep.equal([
          {
            sort: 0,
            amount: "0.50",
          },
          {
            sort: 1,
            amount: "3",
          },
        ]);
      });
    });
  });
});
