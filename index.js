import { readJSON } from "./utils/file.js";
import { preparedTransactions } from "./services/transaction.js";
import { getCommissionFee } from "./services/commission.js";

const start = async () => {
  if (process.argv.length < 3) {
    console.error(`Command should be: node index.js 'FILENAME.json'`);
    return;
  }
  const data = await readJSON(process.argv[2]);
  const transaction = preparedTransactions(data);
  const commissionFees = await getCommissionFee(transaction);
  commissionFees.forEach((d) => {
    console.log(d);
  });
};

start();
