import { useEffect, useState } from "react";

import {
    FiBarChart2,
    FiInfo,
    FiRefreshCw,
    FiSend
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function FreelancerTransactions() {
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [receiverId, setReceiverId] = useState("");
    const [amount, setAmount] = useState("");

    const [transferring, setTransferring] = useState(false);
    const [success, setSuccess] = useState("");
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
            console.error("Failed to load transactions:", err);

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

    const handleTransfer = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const trimmedReceiverId = receiverId.trim();
        const numericAmount = Number(amount);

        if (!trimmedReceiverId) {
            setError("Please enter the receiver's user ID.");
            return;
        }

        if (trimmedReceiverId === userId) {
            setError("You cannot transfer money to yourself.");
            return;
        }

        if (
            !amount.trim() ||
            !Number.isFinite(numericAmount) ||
            numericAmount <= 0
        ) {
            setError("Enter an amount greater than zero.");
            return;
        }

        try {
            setTransferring(true);

            await apiRequest(
                `/transactions/transfer/${encodeURIComponent(userId)}/${encodeURIComponent(trimmedReceiverId)}?amount=${encodeURIComponent(numericAmount)}`,
                {
                    method: "POST"
                }
            );

            setSuccess(
                `Transfer of ₹${numericAmount.toLocaleString("en-IN", {
                    maximumFractionDigits: 2
                })} completed successfully.`
            );

            setReceiverId("");
            setAmount("");

            await loadTransactions(true);
        } catch (err) {
            console.error("Transfer failed:", err);

            setError(
                err.message ||
                "Transfer failed. Please check the receiver ID and your wallet balance."
            );
        } finally {
            setTransferring(false);
        }
    };

    return (
        <DashboardLayout
            title="Transactions"
            subtitle="View wallet transactions and transfer funds to another freelancer."
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

            {success && (
                <div className="success-message dashboard-message">
                    <FiInfo />
                    <span>{success}</span>
                </div>
            )}

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">
                            Transfer to Freelancer
                        </h2>

                        <p className="card-subtitle">
                            Transfer funds from your wallet to another
                            freelancer's wallet.
                        </p>
                    </div>

                    <div className="stat-icon">
                        <FiSend />
                    </div>
                </div>

                <form onSubmit={handleTransfer}>
                    <div className="form-group">
                        <label htmlFor="receiverId">
                            Receiver's User ID
                        </label>

                        <input
                            id="receiverId"
                            type="text"
                            value={receiverId}
                            onChange={(event) =>
                                setReceiverId(event.target.value)
                            }
                            placeholder="Enter the receiver's user ID"
                            required
                            disabled={transferring}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="transferAmount">
                            Amount (₹)
                        </label>

                        <input
                            id="transferAmount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(event.target.value)
                            }
                            placeholder="Enter amount to transfer"
                            required
                            disabled={transferring}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={transferring || !userId}
                    >
                        <FiSend />

                        {transferring
                            ? "Processing Transfer..."
                            : "Transfer Money"}
                    </button>
                </form>

                <p className="card-subtitle">
                    Transfers are permitted only between freelancer
                    accounts. Make sure the receiver's user ID is correct.
                </p>
            </div>

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
                                    Number(transaction.amount || 0),
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
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => loadTransactions(true)}
                        disabled={loading || refreshing}
                    >
                        <FiRefreshCw />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <strong>Loading transactions...</strong>
                        Please wait while we retrieve your transaction history.
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <strong>No transactions found</strong>
                        Your wallet transactions will appear here.
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
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.id}</td>

                                        <td>
                                            {transaction.paymentId || "—"}
                                        </td>

                                        <td>
                                            <span className="status-badge">
                                                {transaction.type || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>
                                                ₹
                                                {Number(
                                                    transaction.amount || 0
                                                ).toLocaleString("en-IN")}
                                            </strong>
                                        </td>

                                        <td>{transaction.date || "—"}</td>

                                        <td>{transaction.time || "—"}</td>

                                        <td>{transaction.remarks || "—"}</td>
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