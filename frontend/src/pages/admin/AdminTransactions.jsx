
import { useCallback, useEffect, useState } from "react";
import { FiActivity, FiRefreshCw } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { getAdminTransactions } from "../../services/adminService";
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

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount ?? 0),
    0
  );

  return (
    <DashboardLayout
      title="Transaction Monitoring"
      subtitle="Review wallet transactions across FlowFund accounts."
      role="ADMIN"
      navItems={navItems}
    >
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Transactions</h1>
            <p>Review transaction type, account owner, amount, and date.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadTransactions}
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
              <span className="admin-stat-label">Total Records</span>
              <span className="admin-stat-icon"><FiActivity /></span>
            </div>
            <div className="admin-stat-value">{transactions.length}</div>
            <div className="admin-stat-note">Transaction entries returned by the backend</div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Sum of Transaction Entries</span>
              <span className="admin-stat-icon">₹</span>
            </div>
            <div className="admin-stat-value">
              {formatCurrency(totalAmount)}
            </div>
            <div className="admin-stat-note">
              Debit and credit entries may represent the same movement of funds
            </div>
          </div>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>All Transactions</h2>
          </div>

          {loading ? (
            <div className="admin-loading">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="admin-empty">No transaction records found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Payment ID</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="admin-primary-text">
                          {transaction.id
                            ? `${String(transaction.id).slice(0, 8)}…`
                            : "—"}
                        </div>
                      </td>
                      <td>
                        <div className="admin-primary-text">
                          {transaction.userName || "—"}
                        </div>
                        <div className="admin-secondary-text">
                          {transaction.userEmail || ""}
                        </div>
                      </td>
                      <td>{transaction.type || "—"}</td>
                      <td className="admin-primary-text">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.time || "—"}</td>
                      <td>
                        {transaction.paymentId
                          ? `${String(transaction.paymentId).slice(0, 8)}…`
                          : "—"}
                      </td>
                      <td>{transaction.remarks || "—"}</td>
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

export default AdminTransactions;
