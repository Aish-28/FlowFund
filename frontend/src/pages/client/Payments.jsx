import { useEffect, useState } from "react";
import {
    FiCreditCard,
    FiInfo,
    FiRefreshCw
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const userId = getUserId();

    const loadPayments = async (isRefresh = false) => {
        try {
            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await apiRequest(
                `/payments/client/${userId}`
            );

            setPayments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load payments:", err);

            setError(
                err.message || "Unable to load payment history."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadPayments();
        } else {
            setError("User information is not available.");
            setLoading(false);
        }
    }, [userId]);

    const getStatusClass = (status) => {
        if (status === "SUCCESS") {
            return "status-success";
        }

        if (status === "PENDING") {
            return "status-warning";
        }

        if (status === "FAILED") {
            return "status-danger";
        }

        return "";
    };

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    return (
        <DashboardLayout
            title="Payments"
            subtitle="View payments made from your FlowFund account."
            role="CLIENT"
            navItems={[
                {
                    label: "Dashboard",
                    to: "/client-dashboard",
                    icon: "dashboard"
                },
                {
                    label: "Wallet",
                    to: "/client-wallet",
                    icon: "wallet"
                },
                {
                    label: "Payments",
                    to: "/client-payments",
                    icon: "transactions",
                    active: true
                },
                {
                    label: "Transactions",
                    to: "/client-transactions",
                    icon: "transactions"
                },
                {
                    label: "Profile",
                    to: "/profile",
                    icon: "settings"
                }
            ]}
        >
            {error && (
                <div className="error-message dashboard-message">
                    <FiInfo />
                    <span>{error}</span>
                </div>
            )}

            <div className="dashboard-grid stats-grid">
                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Payments</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        {payments.length}
                    </div>

                    <div className="stat-note">
                        Payments made from your account
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Successful Payments</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        {
                            payments.filter(
                                (payment) =>
                                    payment.status === "SUCCESS"
                            ).length
                        }
                    </div>

                    <div className="stat-note">
                        Successfully completed payments
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Paid</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        {formatAmount(
                            payments
                                .filter(
                                    (payment) =>
                                        payment.status === "SUCCESS"
                                )
                                .reduce(
                                    (total, payment) =>
                                        total +
                                        Number(payment.amount || 0),
                                    0
                                )
                        )}
                    </div>

                    <div className="stat-note">
                        Total successful payment amount
                    </div>
                </div>
            </div>

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">
                            Payment History
                        </h2>

                        <p className="card-subtitle">
                            Payments made from your client account.
                        </p>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() => loadPayments(true)}
                        disabled={loading || refreshing}
                    >
                        <FiRefreshCw />
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <strong>Loading payments...</strong>
                        Please wait while we retrieve your payment history.
                    </div>
                ) : payments.length === 0 ? (
                    <div className="empty-state">
                        <strong>No payments found</strong>
                        You have not made any payments yet.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Freelancer ID</th>
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
                                            {payment.id || "—"}
                                        </td>

                                        <td>
                                            {payment.freelancerId || "—"}
                                        </td>

                                        <td>
                                            <strong>
                                                {formatAmount(
                                                    payment.amount
                                                )}
                                            </strong>
                                        </td>

                                        <td>
                                            {payment.date || "—"}
                                        </td>

                                        <td>
                                            {payment.time || "—"}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    payment.status
                                                )}`}
                                            >
                                                {payment.status || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}