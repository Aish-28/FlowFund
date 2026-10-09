
import { API_URL, apiRequest } from "./api";

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Admin login failed"
    );
  }

  return data;
};

export const getAdminDashboardStats = () =>
  apiRequest("/admin/dashboard/stats");

export const getAdminUsers = () =>
  apiRequest("/admin/users");

export const updateAdminUserStatus = (userId, status) =>
  apiRequest(
    `/admin/users/${userId}/status?status=${encodeURIComponent(status)}`,
    { method: "PUT" }
  );

export const getAdminPayments = () =>
  apiRequest("/admin/payments");

export const getAdminTransactions = () =>
  apiRequest("/admin/transactions");

export const createAdmin = (adminData) =>
  apiRequest("/admin/register", {
    method: "POST",
    body: JSON.stringify(adminData),
  });