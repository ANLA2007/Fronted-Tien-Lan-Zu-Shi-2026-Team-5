import { post } from '../../CORE/SERVICES/api.services.js';

export async function login(userName, password) {
  const response = await post('Auth/login', { userName, password });
  if (response && response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
}

export async function logout() {
  localStorage.removeItem('token');
}