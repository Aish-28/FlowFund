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

export default function FreelancerPayments() {
    const [transactions, setTransactions] = useState([]);
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
                `/transactions/user/${userId}`
            );

            setTransactions(
                Array.isArray(data)
                    ? data.filter(
                        (transaction) =>
                            transaction.type === "CREDIT"
                    )
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load received payments:",
                err
            );

            setError(
                err.message ||
                "Unable to load received payments."
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

    const totalReceived = transactions.reduce(
        (total, transaction) =>
            total + Number(transaction.amount || 0),
        0
    );

    return (
        <DashboardLayout
            title="Payments"
            subtitle="View payments received from your clients."
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
                    icon: "transactions",
                    active: true
                },
                {
                    label: "Payout",
                    to: "/freelancer-payout",
                    icon: "settings"
                },
                {
                    label: "Transactions",
                    to: "/freelancer-transactions",
                    icon: "transactions"
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
                        <span>Payments Received</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        {transactions.length}
                    </div>

                    <div className="stat-note">
                        Successful credits to your wallet
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Received</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        ₹
                        {totalReceived.toLocaleString(
                            "en-IN"
                        )}
                    </div>

                    <div className="stat-note">
                        Total amount received
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
                            Payments credited to your FlowFund wallet.
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
                        <strong>
                            Loading payments...
                        </strong>

                        Please wait while we retrieve
                        your payment history.
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <strong>
                            No payments received
                        </strong>

                        Payments received from clients
                        will appear here.
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
                                        Amount
                                    </th>
                                    <th>
                                        Date
                                    </th>
                                    <th>
                                        Time
                                    </th>
                                    <th>
                                        Type
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
                                                <span className="status-badge status-success">
                                                    CREDIT
                                                </span>
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