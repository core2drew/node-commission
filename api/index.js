import axios from "axios";

const API = "http://private-38e18c-uzduotis.apiary-mock.com";

const handleErrorResponse = (err) => {
  return new Error(err);
};

export const Get = async (url, params) => {
  try {
    const res = await axios.get(`${API}/${url}`, {
      params,
    });
    return res.data;
  } catch (err) {
    throw handleErrorResponse(err);
  }
};

export const Post = async (url, body, config) => {
  try {
    const res = await axios.post(`${API}/${url}`, body, config);
    return res.data;
  } catch (err) {
    throw handleErrorResponse(err);
  }
};

export const Put = async (url, body, config) => {
  try {
    const res = await axios.put(`${API}/${url}`, body, config);
    return res.data;
  } catch (err) {
    throw handleErrorResponse(err);
  }
};

export const Delete = async (url, body, config) => {
  try {
    const res = await axios.delete(`${API}/${url}`, body, config);
    return res.data;
  } catch (err) {
    throw handleErrorResponse(err);
  }
};
