import axios from 'axios'

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const logIn = (FormData) => API.post('/login', FormData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const signUp = (FormData) => API.post('/register', FormData, { headers: { 'Content-Type': 'multipart/form-data' } });