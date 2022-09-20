import axios from 'axios';

const api = axios.create({
  baseURL: 'https://onmovie.video/app/'
})

export default api;

export const baseUrl = 'https://onmovie.video/app/';

export const libraryBaseUrl = 'https://onmovie.video/library/';

export const finalFileBaseUrl = `https://onmovie.video/arquivos_finalizados`;

export const apiStripe = axios.create({
  baseURL: 'https://onmovie.video/stripe/'
});

export const apiFinalFile = axios.create({
  baseURL: 'https://onmovie.video/arquivos_finalizados/'
})