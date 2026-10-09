import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiInfo,
    FiRefreshCw
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const userId = getUserId();

    const loadTransactions = async (isRefresh = false) => {
        try {
            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await apiRequest(
                `/transactions/user/${userId}`
            );

            setTransactions(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Failed to load transactions:",
                err
            );

            setError(
                err.message ||
                "Unable to load transaction history."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadTransactions();
        } else {
            setError("User information is not available.");
            setLoading(false);
        }
    }, [userId]);

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    return (
        <DashboardLayout
            title="Transactions"
            subtitle="View all wallet transactions associated with your account."
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
                    icon: "transactions"
                },
                {
                    label: "Transactions",
                    to: "/client-transactions",
                    icon: "transactions",
                    active: true
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
                        <span>Total Transactions</span>

                        <div className="stat-icon">
                            <FiBarChart2 />
                        </div>
                    </div>

                    <div className="stat-value">
                        {transactions.length}
                    </div>

                    <div className="stat-note">
                        Wallet transactions
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Transaction Value</span>

                        <div className="stat-icon">
                            <FiBarChart2 />
                        </div>
                    </div>

                    <div className="stat-value">
                        {formatAmount(
                            transactions.reduce(
                                (total, transaction) =>
                                    total +
                                    Number(
                                        transaction.amount || 0
                                    ),
                                0
                            )
                        )}
                    </div>

                    <div className="stat-note">
                        Combined transaction amount
                    </div>
                </div>
            </div>

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">
                            Transaction History
                        </h2>

                        <p className="card-subtitle">
                            Complete wallet transaction history.
                        </p>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            loadTransactions(true)
                        }
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
                        <strong>
                            Loading transactions...
                        </strong>

                        Please wait while we retrieve your
                        transaction history.
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <strong>
                            No transactions found
                        </strong>

                        There are no wallet transactions to
                        display yet.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Payment ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map(
                                    (transaction) => (
                                        <tr
                                            key={
                                                transaction.id
                                            }
                                        >
                                            <td>
                                                {
                                                    transaction.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction.paymentId ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                <span className="status-badge">
                                                    {
                                                        transaction.type ||
                                                        "—"
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    transaction.date ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction.time ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    transaction.remarks ||
                                                    "—"
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}