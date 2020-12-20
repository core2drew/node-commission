export const getUniqueItems = (data, prop) => {
  const set = new Set();
  data.forEach((item) => set.add(item[prop]));
  return Array.from(set);
};
