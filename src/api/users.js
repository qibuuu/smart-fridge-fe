import apiClient from './apiClient';

export const getAllUsers = () => apiClient.get('/users');

export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);

export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
