// Return array of unique item
export const getUniqueItems = (data, prop) => {
  const set = new Set();
  data.forEach((item) => {
    if (item.hasOwnProperty(prop)) {
      set.add(item[prop]);
    }
  });
  return Array.from(set);
};
