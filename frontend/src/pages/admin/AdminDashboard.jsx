
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiArrowRight,
} from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { getAdminDashboardStats } from "../../services/adminService";
import "./AdminModule.css";

const navItems = [
  { label: "Dashboard", path: "/admin-dashboard", icon: "dashboard" },
  { label: "Users", path: "/admin-users", icon: "users" },
  { label: "Payments", path: "/admin-payments", icon: "wallet" },
  { label: "Transactions", path: "/admin-transactions", icon: "transactions" },
];

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Could not load admin dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const statCards = [
    {
      label: "Total Users",
      value: formatNumber(stats?.totalUsers),
      note: "All registered clients and freelancers",
      icon: <FiUsers />,
    },
    {
      label: "Total Clients",
      value: formatNumber(stats?.totalClients),
      note: "Registered client accounts",
      icon: <FiUserCheck />,
    },
    {
      label: "Total Freelancers",
      value: formatNumber(stats?.totalFreelancers),
      note: "Registered freelancer accounts",
      icon: <FiUsers />,
    },
    {
      label: "Total Payments",
      value: formatNumber(stats?.totalPayments),
      note: "Recorded client-to-freelancer payments",
      icon: <FiCreditCard />,
    },
    {
      label: "Payment Amount",
      value: formatCurrency(stats?.totalPaymentAmount),
      note: "Total amount recorded in payments",
      icon: <FiDollarSign />,
    },
    {
      label: "Total Transactions",
      value: formatNumber(stats?.totalTransactions),
      note: "Recorded wallet transactions",
      icon: <FiActivity />,
    },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Monitor FlowFund accounts and financial activity."
      role="ADMIN"
      navItems={navItems}
    >
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Admin Overview</h1>
            <p>Review platform activity, users, payments, and transactions.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadStats}
            disabled={loading}
          >
            <FiRefreshCw />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <div className="admin-message admin-error">{error}</div>}

        {loading && !stats ? (
          <div className="admin-panel admin-loading">
            Loading dashboard statistics...
          </div>
        ) : (
          <div className="admin-stats-grid">
            {statCards.map((card) => (
              <div className="admin-stat-card" key={card.label}>
                <div className="admin-stat-top">
                  <span className="admin-stat-label">{card.label}</span>
                  <span className="admin-stat-icon">{card.icon}</span>
                </div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-note">{card.note}</div>
              </div>
            ))}
          </div>
        )}

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h2>Manage FlowFund</h2>
          </div>

          <div className="admin-quick-links">
            <Link className="admin-quick-link" to="/admin-users">
              <span>
                <FiUsers className="admin-quick-link-icon" />
                Manage Users
              </span>
              <FiArrowRight />
            </Link>

            <Link className="admin-quick-link" to="/admin-payments">
              <span>
                <FiCreditCard className="admin-quick-link-icon" />
                View Payments
              </span>
              <FiArrowRight />
            </Link>

            <Link className="admin-quick-link" to="/admin-transactions">
              <span>
                <FiActivity className="admin-quick-link-icon" />
                View Transactions
              </span>
              <FiArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;