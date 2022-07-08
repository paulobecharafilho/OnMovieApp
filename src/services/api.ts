import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zrgpro.com/on_app/user/'
})

export default api;

export const baseUrl = 'https://zrgpro.com/on_app/user/';

export const libraryBaseUrl = 'https://zrgpro.com/on_app/library/'