import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.135.42:5006/api",
});

export default api;
