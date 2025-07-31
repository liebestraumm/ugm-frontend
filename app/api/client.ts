import axios from "axios";

export const baseURL = "https://ugm-backend.vercel.app/api";
// export const baseURL = "http://192.168.1.4:8000/api";

const client = axios.create({ baseURL });

export default client;
