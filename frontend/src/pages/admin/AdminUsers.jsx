
import { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiShield } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { getAdminUsers, updateAdminUserStatus } from "../../services/adminService";
import "./AdminModule.css";

const navItems = [
  { label: "Dashboard", path: "/admin-dashboard", icon: "dashboard" },
  { label: "Users", path: "/admin-users", icon: "users" },
  { label: "Payments", path: "/admin-payments", icon: "wallet" },
  { label: "Transactions", path: "/admin-transactions", icon: "transactions" },
];

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN");
};

const normalizeStatus = (status) => String(status ?? "").toUpperCase();

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusChange = async (user) => {
    const currentStatus = normalizeStatus(user.status);
    const nextStatus = currentStatus === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const action = nextStatus === "BLOCKED" ? "block" : "unblock";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${user.name || "this user"}?`
      )
    ) {
      return;
    }

    setUpdatingId(user.id);
    setError("");
    setSuccess("");

    try {
      await updateAdminUserStatus(user.id, nextStatus);
      setSuccess(
        `${user.name || "User"} has been ${nextStatus === "BLOCKED" ? "blocked" : "unblocked"}.`
      );
      await loadUsers();
    } catch (err) {
      setError(err.message || `Could not ${action} this user.`);
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Review registered accounts and manage account access."
      role="ADMIN"
      navItems={navItems}
    >
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>User Management</h1>
            <p>
              {users.length} registered account{users.length === 1 ? "" : "s"}.
              Blocked users should not be able to log in.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadUsers}
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="admin-message admin-error">{error}</div>}
        {success && <div className="admin-message admin-success">{success}</div>}

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Registered Users</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const blocked = normalizeStatus(user.status) === "BLOCKED";

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-primary-text">
                            {user.name || "—"}
                          </div>
                          <div className="admin-secondary-text">
                            {user.email || "—"}
                          </div>
                        </td>
                        <td>{user.phNo || "—"}</td>
                        <td>{user.role || "—"}</td>
                        <td>
                          <span
                            className={`admin-status ${
                              blocked
                                ? "admin-status-blocked"
                                : normalizeStatus(user.status) === "ACTIVE"
                                  ? "admin-status-active"
                                  : "admin-status-default"
                            }`}
                          >
                            {user.status || "UNKNOWN"}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button
                            type="button"
                            className={`admin-action-button ${
                              blocked
                                ? "admin-status-button-unblock"
                                : "admin-status-button-block"
                            }`}
                            onClick={() => handleStatusChange(user)}
                            disabled={updatingId === user.id}
                          >
                            <FiShield />
                            {updatingId === user.id
                              ? "Updating..."
                              : blocked
                                ? "Unblock"
                                : "Block"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;