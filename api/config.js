import { Get } from "./index.js";

export const getCashInConfig = async () => {
  try {
    const res = await Get("config/cash-in");
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export const getCashOutConfig = async (userType) => {
  try {
    const res = await Get(`config/cash-out/${userType}`);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};
