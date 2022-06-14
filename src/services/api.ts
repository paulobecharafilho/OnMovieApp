import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zrgpro.com/apis_paulinho/'
})

export default api;