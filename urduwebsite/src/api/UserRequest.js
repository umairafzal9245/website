import axios from 'axios'

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const skipSentence = (userId) => API.post(`/skipSentence?id=${userId}`);

export const uploadRecording = (userId, formdata) => API.post(`/saveAudio?id=${userId}`, formdata, { Headers: { 'Content-Type': 'multipart/form-data' } });

export const getRecording = (recordingname) => API.get(`/getAudio?audio=${recordingname}`, { responseType: 'blob' });

export const deleteRecording = (id, recordingname) => API.post(`/deleteAudio?audio=${recordingname}&id=${id}`);