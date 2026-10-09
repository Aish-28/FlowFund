
import { useCallback, useEffect, useState } from "react";
import { FiCreditCard, FiRefreshCw } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { getAdminPayments } from "../../services/adminService";
import "./AdminModule.css";

const navItems = [
  { label: "Dashboard", path: "/admin-dashboard", icon: "dashboard" },
  { label: "Users", path: "/admin-users", icon: "users" },
  { label: "Payments", path: "/admin-payments", icon: "wallet" },
  { label: "Transactions", path: "/admin-transactions", icon: "transactions" },
  { label: "Add Admin", path: "/admin/add", icon: "settings" },
];

const formatCurrency = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-IN");
};

const statusClass = (status) => {
  const value = String(status ?? "").toUpperCase();
  if (value === "SUCCESS" || value === "COMPLETED") return "admin-status-success";
  if (value === "FAILED" || value === "BLOCKED") return "admin-status-failed";
  if (value === "PENDING") return "admin-status-pending";
  return "admin-status-default";
};

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  return (
    <DashboardLayout
      title="Payment Monitoring"
      subtitle="Review payments recorded between clients and freelancers."
      role="ADMIN"
      navItems={navItems}
    >
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Payments</h1>
            <p>Review payment amounts, participants, dates, and statuses.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadPayments}
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="admin-message admin-error">{error}</div>}

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Recorded Payments</span>
              <span className="admin-stat-icon"><FiCreditCard /></span>
            </div>
            <div className="admin-stat-value">{payments.length}</div>
            <div className="admin-stat-note">Payment records returned by the backend</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Payment Amount</span>
              <span className="admin-stat-icon">₹</span>
            </div>
            <div className="admin-stat-value">
              {formatCurrency(totalAmount)}
            </div>
            <div className="admin-stat-note">
              Sum of the amounts in the displayed payment records
            </div>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>All Payments</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="admin-empty">No payment records found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Client</th>
                    <th>Freelancer</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <div className="admin-primary-text">
                          {payment.id ? `${String(payment.id).slice(0, 8)}…` : "—"}
                        </div>
                      </td>
                      <td>
                        <div className="admin-primary-text">
                          {payment.clientName || "—"}
                        </div>
                        <div className="admin-secondary-text">
                          {payment.clientEmail || ""}
                        </div>
                      </td>
                      <td>
                        <div className="admin-primary-text">
                          {payment.freelancerName || "—"}
                        </div>
                        <div className="admin-secondary-text">
                          {payment.freelancerEmail || ""}
                        </div>
                      </td>
                      <td className="admin-primary-text">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td>{formatDate(payment.date)}</td>
                      <td>{payment.time || "—"}</td>
                      <td>
                        <span className={`admin-status ${statusClass(payment.status)}`}>
                          {payment.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminPayments;
