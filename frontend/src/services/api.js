import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to auth header
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Authentication endpoints
export async function signUp(userData) {
  const { data } = await apiClient.post('/auth/signup', userData);
  return data;
}

export async function signIn(credentials) {
  const { data } = await apiClient.post('/auth/signin', credentials);
  return data;
}

// Vacation requests endpoints
export async function createRequest(payload, token) {
  const { data } = await apiClient.post(
    '/requests',
    payload,
    authHeader(token)
  );
  return data;
}

export async function getMyRequests(token) {
  const { data } = await apiClient.get(
    '/requests/my-requests',
    authHeader(token)
  );
  console.log('getAllRequests data:', data);
  return data;
}

export async function getAllRequests(token) {
  const { data } = await apiClient.get(
    '/requests/all-requests',
    authHeader(token)
  );
  return data;
}

export async function approveRequest(id, token) {
  const { data } = await apiClient.put(
    `/requests/${id}/approve`,
    {},
    authHeader(token)
  );
  return data;
}

export async function rejectRequest(id, comments, token) {
  const { data } = await apiClient.put(
    `/requests/${id}/reject`,
    { comments },
    authHeader(token)
  );
  return data;
}

export default apiClient;
