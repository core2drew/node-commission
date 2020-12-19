export const getUniqueValues = (data, prop) => {
  const set = new Set();
  data.forEach((item) => set.add(item[prop]));
  return Array.from(set);
};
