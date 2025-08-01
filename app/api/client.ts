import axios from "axios";

export const baseURL =
  "https://arcane-forest-86800-4cdf53ca9f0b.herokuapp.com/api";
// export const baseURL = "http://192.168.1.4:8000/api";

const client = axios.create({ baseURL });

export default client;
