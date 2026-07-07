import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const getProducts = () => api.get('/products/');
export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.patch('/products/' + id, data);
export const deleteProduct = (id) => api.delete('/products/' + id);