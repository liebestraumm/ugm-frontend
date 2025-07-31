import axios from "axios";

export const baseURL = "https://ugm-backend.vercel.app/api";

const client = axios.create({ baseURL });

export default client;
