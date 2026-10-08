import { useEffect, useState } from "react";
import {
    FiCreditCard,
    FiRefreshCw,
    FiInfo
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function Wallet() {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

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
            setError(
                err.message || "Unable to load wallet details."
            );
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
    const reserveBalance = Number(
        wallet?.reserveBalance || 0
    );

    return (
        <DashboardLayout
            title="Wallet"
            subtitle="Manage your FlowFund wallet balance and reserve."
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
                    icon: "wallet",
                    active: true
                },
                {
                    label: "Payments",
                    to: "/client-payments",
                    icon: "transactions"
                },
                {
                    label: "Transactions",
                    to: "/client-transactions",
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
                            <FiCreditCard />
                        </div>
                    </div>

                    <div className="stat-value">
                        ₹{reserveBalance.toLocaleString("en-IN")}
                    </div>

                    <div className="stat-note">
                        Amount kept as reserve
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>Wallet Status</span>

                        <div className="stat-icon">
                            <FiInfo />
                        </div>
                    </div>

                    <div className="stat-value">
                        {wallet?.status || "—"}
                    </div>

                    <div className="stat-note">
                        Current wallet status
                    </div>
                </div>
            </div>

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">
                            Wallet Details
                        </h2>

                        <p className="card-subtitle">
                            Information retrieved from your FlowFund wallet.
                        </p>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() => loadWallet(true)}
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
                        <strong>Loading wallet...</strong>
                        Please wait while we retrieve your wallet details.
                    </div>
                ) : wallet ? (
                    <>
                        <div className="info-strip">
                            <FiInfo />

                            <span>
                                Your wallet balance is used for
                                payments made through FlowFund.
                                Your reserve balance is maintained
                                separately.
                            </span>
                        </div>

                        <div className="wallet-summary-box">
                            <div>
                                <span>Wallet ID</span>

                                <strong>
                                    {wallet.id || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>User ID</span>

                                <strong>
                                    {wallet.userId || userId || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Available Balance</span>

                                <strong>
                                    ₹
                                    {balance.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Reserve Balance</span>

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
                        <strong>No wallet details found</strong>
                        Your wallet information could not be loaded.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}