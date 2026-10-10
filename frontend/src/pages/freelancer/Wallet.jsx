
import { useEffect, useState } from "react";
import {
    FiCreditCard,
    FiInfo,
    FiRefreshCw,
    FiShield
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function FreelancerWallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reserveAmount, setReserveAmount] = useState("");
    const [savingReserve, setSavingReserve] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = getUserId();

    const loadWallet = async (isRefresh = false) => {
        try {
            setError("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await apiRequest(
                `/wallets/user/${userId}`
            );

            setWallet(data);
        } catch (err) {
            console.error("Failed to load wallet:", err);
            setError(err.message || "Unable to load wallet details.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadWallet();
        } else {
            setError("User information is not available.");
            setLoading(false);
        }
    }, [userId]);

    const balance = Number(wallet?.balance || 0);
    const reserveBalance = Number(wallet?.reserveBalance || 0);
    const totalFunds = balance + reserveBalance;

    const handleReserveSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (reserveAmount.trim() === "") {
            setError("Please enter a reserve amount.");
            return;
        }

        const amount = Number(reserveAmount);

        if (!Number.isFinite(amount) || amount < 0) {
            setError("Reserve amount cannot be negative.");
            return;
        }

        if (amount > totalFunds) {
            setError(
                "Reserve amount cannot exceed your total wallet funds."
            );
            return;
        }

        try {
            setSavingReserve(true);

            const updatedWallet = await apiRequest(
                `/wallets/user/${encodeURIComponent(userId)}/reserve?amount=${encodeURIComponent(amount)}`,
                {
                    method: "PUT"
                }
            );

            setWallet(updatedWallet);
            setReserveAmount("");
            setSuccess("Reserve balance updated successfully.");
        } catch (err) {
            console.error("Failed to update reserve balance:", err);
            setError(
                err.message || "Unable to update reserve balance."
            );
        } finally {
            setSavingReserve(false);
        }
    };

    return (
        <DashboardLayout
            title="Wallet"
            subtitle="Manage your freelancer wallet and reserve."
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
                    icon: "wallet",
                    active: true
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
                    <FiShield />
                    <span>{success}</span>
                </div>
            )}

            <div className="dashboard-grid stats-grid">
                <div className="stat-card">
                    <div className="stat-label">
                        <span>Available Balance</span>
                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>
                    <div className="stat-value">
                        ₹{balance.toLocaleString("en-IN")}
                    </div>
                    <div className="stat-note">
                        Current wallet balance
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Reserve Balance</span>
                        <div className="stat-icon">
                            <FiShield />
                        </div>
                    </div>
                    <div className="stat-value">
                        ₹{reserveBalance.toLocaleString("en-IN")}
                    </div>
                    <div className="stat-note">
                        Amount retained as reserve
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Total Wallet Funds</span>
                        <div className="stat-icon">
                            <FiCreditCard />
                        </div>
                    </div>
                    <div className="stat-value">
                        ₹{totalFunds.toLocaleString("en-IN")}
                    </div>
                    <div className="stat-note">
                        Available balance + reserve
                    </div>
                </div>
            </div>

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">Wallet Details</h2>
                        <p className="card-subtitle">
                            Information retrieved from your FlowFund wallet.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => loadWallet(true)}
                        disabled={loading || refreshing || savingReserve}
                    >
                        <FiRefreshCw />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="empty-state">
                        <strong>Loading wallet...</strong>
                        Please wait while we retrieve your wallet details.
                    </div>
                ) : wallet ? (
                    <>
                        <div className="info-strip">
                            <FiInfo />
                            <span>
                                Your reserve is part of your existing wallet
                                funds. Setting it changes how your funds are
                                allocated; it does not add money.
                            </span>
                        </div>

                        <div className="wallet-summary-box">
                            <div>
                                <span>Wallet ID</span>
                                <strong>{wallet.id || "—"}</strong>
                            </div>

                            <div>
                                <span>User ID</span>
                                <strong>
                                    {wallet.user?.id || wallet.userId || userId || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Available Balance</span>
                                <strong>
                                    ₹{balance.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <span>Reserve Balance</span>
                                <strong>
                                    ₹{reserveBalance.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <span>Wallet Status</span>
                                <strong>{wallet.status || "—"}</strong>
                            </div>
                        </div>

                        <div className="section-gap">
                            <h2 className="card-title">
                                Set Reserve Balance
                            </h2>
                            <p className="card-subtitle">
                                Choose how much of your total funds to retain
                                as your reserve for future monthly payouts.
                            </p>

                            <form onSubmit={handleReserveSubmit}>
                                <div className="form-group">
                                    <label htmlFor="reserveAmount">
                                        Reserve amount (₹)
                                    </label>
                                    <input
                                        id="reserveAmount"
                                        type="number"
                                        min="0"
                                        max={totalFunds}
                                        step="0.01"
                                        value={reserveAmount}
                                        onChange={(event) => {
                                            setReserveAmount(event.target.value);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        placeholder="Enter reserve amount"
                                        disabled={savingReserve}
                                        required
                                    />
                                    <small>
                                        Maximum available to allocate: ₹
                                        {totalFunds.toLocaleString("en-IN")}
                                    </small>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={savingReserve || !wallet}
                                >
                                    {savingReserve
                                        ? "Saving..."
                                        : "Set Reserve Balance"}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <strong>No wallet details found</strong>
                        Your wallet information could not be loaded.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
