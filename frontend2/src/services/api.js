import axios from 'axios';


const api = axios.create({
  baseURL: '${baseURL}',
  withCredentials: true,
});

export default api;
