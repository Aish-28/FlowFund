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

export default function FreelancerTransactions() {
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

    return (
        <DashboardLayout
            title="Transactions"
            subtitle="View all wallet transactions on your account."
            role="FREELANCER"
            navItems={[
                {
                    label: "Dashboard",
                    to: "/freelancer-dashboard",
                    icon: "dashboard"
                },
                {
                    label: "Wallet",
                    to: "/freelancer-wallet",
                    icon: "wallet"
                },
                {
                    label: "Payments",
                    to: "/freelancer-payments",
                    icon: "transactions"
                },
                {
                    label: "Payout",
                    to: "/freelancer-payout",
                    icon: "settings"
                },
                {
                    label: "Transactions",
                    to: "/freelancer-transactions",
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
                        All wallet transactions
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
                        ₹
                        {transactions
                            .reduce(
                                (total, transaction) =>
                                    total +
                                    Number(
                                        transaction.amount ||
                                        0
                                    ),
                                0
                            )
                            .toLocaleString("en-IN")}
                    </div>

                    <div className="stat-note">
                        Combined transaction value
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

                        Please wait while we retrieve
                        your transaction history.
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <strong>
                            No transactions found
                        </strong>

                        Your wallet transactions will
                        appear here.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        Transaction ID
                                    </th>
                                    <th>
                                        Payment ID
                                    </th>
                                    <th>
                                        Type
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Date
                                    </th>
                                    <th>
                                        Time
                                    </th>
                                    <th>
                                        Remarks
                                    </th>
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
                                                    ₹
                                                    {Number(
                                                        transaction.amount ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
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