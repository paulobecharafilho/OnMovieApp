import axios from 'axios';

const api = axios.create({
  baseURL: 'https://onmovie.com.br/on_movie/app/'
})

export default api;

export const baseUrl = 'https://onmovie.com.br/on_movie/app/';

export const libraryBaseUrl = 'https://onmovie.com.br/on_movie/library/';

export const finalFileBaseUrl = `https://onmovie.com.br/on_movie/arquivos_finalizados`;

export const apiStripe = axios.create({
  baseURL: 'https://onmovie.com.br/on_movie/stripe/'
});

export const apiFinalFile = axios.create({
  baseURL: 'https://onmovie.com.br/on_movie/arquivos_finalizados/'
})