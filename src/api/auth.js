import apiClient from './apiClient';

export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const changePassword = (data) => apiClient.put('/auth/change-password', data);
export const verifyEmail = (otp) => apiClient.post('/auth/verify-email', { otp });
export const resendVerification = (email) => apiClient.post('/auth/resend-verification', { email });
