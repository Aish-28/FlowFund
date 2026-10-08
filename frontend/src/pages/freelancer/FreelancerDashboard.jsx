import { useEffect, useState } from "react";
import {
    FiBarChart2,
    FiCreditCard,
    FiInfo,
    FiRefreshCw
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function FreelancerDashboard() {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = getUserId();

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [walletData, transactionData] =
                await Promise.all([
                    apiRequest(`/wallets/user/${userId}`),
                    apiRequest(`/transactions/user/${userId}`)
                ]);

            setWallet(walletData);

            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load freelancer dashboard:",
                err
            );

            setError(
                err.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadDashboard();
        } else {
            setError("User information is not available.");
            setLoading(false);
        }
    }, [userId]);

    const balance = Number(wallet?.balance || 0);
    const reserveBalance = Number(
        wallet?.reserveBalance || 0
    );

    const receivedAmount = transactions
        .filter(
            (transaction) =>
                transaction.type === "CREDIT"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount || 0),
            0
        );

    return (
        <DashboardLayout
            title="Freelancer Dashboard"
            subtitle="Manage your earnings, wallet and monthly payout."
            role="FREELANCER"
            navItems={[
                {
                    label: "Dashboard",
                    to: "/freelancer-dashboard",
                    icon: "dashboard",
                    active: true
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
                        <span>Wallet Balance</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        ₹{balance.toLocaleString("en-IN")}
                    </div>

                    <div className="stat-note">
                        Available wallet balance
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Reserve Balance</span>

                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        ₹
                        {reserveBalance.toLocaleString(
                            "en-IN"
                        )}
                    </div>

                    <div className="stat-note">
                        Amount retained as reserve
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Received</span>

                        <div className="stat-icon">
                            <FiBarChart2 />
                        </div>
                    </div>

                    <div className="stat-value">
                        ₹
                        {receivedAmount.toLocaleString(
                            "en-IN"
                        )}
                    </div>

                    <div className="stat-note">
                        Total credited transactions
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Transactions</span>

                        <div className="stat-icon">
                            <FiBarChart2 />
                        </div>
                    </div>

                    <div className="stat-value">
                        {transactions.length}
                    </div>

                    <div className="stat-note">
                        Total wallet transactions
                    </div>
                </div>
            </div>

            <div className="dashboard-grid content-grid-2">
                <div className="content-card">
                    <div className="card-title-row">
                        <div>
                            <h2 className="card-title">
                                Wallet Overview
                            </h2>

                            <p className="card-subtitle">
                                Current status of your FlowFund wallet.
                            </p>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={loadDashboard}
                            disabled={loading}
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <strong>
                                Loading wallet...
                            </strong>

                            Please wait while we retrieve
                            your wallet information.
                        </div>
                    ) : wallet ? (
                        <>
                            <div className="info-strip">
                                <FiInfo />

                                <span>
                                    Your wallet stores payments
                                    received from clients and
                                    supports your monthly payout
                                    management.
                                </span>
                            </div>

                            <div className="wallet-summary-box">
                                <div>
                                    <span>
                                        Available Balance
                                    </span>

                                    <strong>
                                        ₹
                                        {balance.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Reserve Balance
                                    </span>

                                    <strong>
                                        ₹
                                        {reserveBalance.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <strong>
                                No wallet data found
                            </strong>
                        </div>
                    )}
                </div>

                <div className="content-card">
                    <div className="card-title-row">
                        <div>
                            <h2 className="card-title">
                                Recent Transactions
                            </h2>

                            <p className="card-subtitle">
                                Your latest wallet activity.
                            </p>
                        </div>
                    </div>

                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <strong>
                                No transactions yet
                            </strong>

                            Transactions will appear here
                            when you receive payments.
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Date
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions
                                        .slice(0, 5)
                                        .map(
                                            (
                                                transaction
                                            ) => (
                                                <tr
                                                    key={
                                                        transaction.id
                                                    }
                                                >
                                                    <td>
                                                        <span className="status-badge">
                                                            {
                                                                transaction.type
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
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}