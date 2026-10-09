import { useEffect, useState } from "react";
import {
    FiCheckCircle,
    FiCalendar,
    FiDollarSign,
    FiInfo,
    FiRefreshCw,
    FiSave
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";
import "./dashboardPages.css";

export default function FreelancerPayout() {
    const [preferences, setPreferences] = useState(null);
    const [payouts, setPayouts] = useState([]);

    const [targetSalary, setTargetSalary] = useState("");
    const [payoutDate, setPayoutDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [creatingPayout, setCreatingPayout] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const userId = getUserId();

    const loadPayoutData = async (isRefresh = false) => {
        try {
            setError("");
            setSuccess("");

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            let preferencesResult = null;
            let payoutsResult = [];

            // Load payout preferences
            try {
                preferencesResult = await apiRequest(
                    `/payout-preferences/user/${userId}`
                );
            } catch (preferenceError) {
                console.log(
                    "No payout preferences found yet."
                );

                preferencesResult = null;
            }

            // Load payout history
            try {
                payoutsResult = await apiRequest(
                    `/payouts/user/${userId}`
                );
            } catch (payoutError) {
                console.error(
                    "Failed to load payout history:",
                    payoutError
                );

                throw payoutError;
            }

            setPreferences(preferencesResult);

            setPayouts(
                Array.isArray(payoutsResult)
                    ? payoutsResult
                    : []
            );

            if (preferencesResult) {
                setTargetSalary(
                    preferencesResult.targetSalary ?? ""
                );

                setPayoutDate(
                    preferencesResult.payoutDate ?? ""
                );
            } else {
                setTargetSalary("");
                setPayoutDate("");
            }
        } catch (err) {
            console.error(
                "Failed to load payout data:",
                err
            );

            setError(
                err.message ||
                "Unable to load payout information."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadPayoutData();
        } else {
            setError(
                "User information is not available."
            );

            setLoading(false);
        }
    }, [userId]);

    const handleSavePreferences = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !targetSalary ||
            Number(targetSalary) <= 0
        ) {
            setError(
                "Please enter a valid target monthly salary."
            );

            return;
        }

        const payoutDay = Number(payoutDate);

        if (
            !payoutDate ||
            payoutDay < 1 ||
            payoutDay > 31
        ) {
            setError(
                "Please enter a valid payout day between 1 and 31."
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                targetSalary: Number(targetSalary),
                payoutDate: payoutDay
            };

            let result;

            if (preferences) {
                result = await apiRequest(
                    `/payout-preferences/user/${userId}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    }
                );
            } else {
                result = await apiRequest(
                    `/payout-preferences/user/${userId}`,
                    {
                        method: "POST",
                        body: JSON.stringify(payload)
                    }
                );
            }

            setPreferences(result);

            if (result) {
                setTargetSalary(
                    result.targetSalary ??
                    targetSalary
                );

                setPayoutDate(
                    result.payoutDate ??
                    payoutDay
                );
            }

            setSuccess(
                "Payout preferences saved successfully."
            );
        } catch (err) {
            console.error(
                "Failed to save payout preferences:",
                err
            );

            setError(
                err.message ||
                "Unable to save payout preferences."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCreatePayout = async () => {
        setError("");
        setSuccess("");

        if (!preferences) {
            setError(
                "Please save your payout preferences before creating a monthly payout."
            );

            return;
        }

        try {
            setCreatingPayout(true);

            await apiRequest(
                `/payouts/user/${userId}`,
                {
                    method: "POST"
                }
            );

            setSuccess(
                "Monthly payout created successfully."
            );

            await loadPayoutData(true);
        } catch (err) {
            console.error(
                "Failed to create monthly payout:",
                err
            );

            setError(
                err.message ||
                "Unable to create monthly payout."
            );
        } finally {
            setCreatingPayout(false);
        }
    };

    const formatAmount = (amount) => {
        return `₹${Number(
            amount || 0
        ).toLocaleString("en-IN")}`;
    };

    return (
        <DashboardLayout
            title="Payout"
            subtitle="Manage your monthly payout preferences."
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
                    label: "Transactions",
                    to: "/freelancer-transactions",
                    icon: "transactions"
                },
                {
                    label: "Payout",
                    to: "/freelancer-payout",
                    icon: "settings",
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
                    <FiCheckCircle />
                    <span>{success}</span>
                </div>
            )}

            <div className="dashboard-grid stats-grid">
                <div className="stat-card">
                    <div className="stat-label">
                        <span>
                            Target Monthly Salary
                        </span>

                        <div className="stat-icon">
                            <FiDollarSign />
                        </div>
                    </div>

                    <div className="stat-value">
                        {preferences
                            ? formatAmount(
                                preferences.targetSalary
                            )
                            : "—"}
                    </div>

                    <div className="stat-note">
                        Your monthly payout target
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>
                            Payout Day
                        </span>

                        <div className="stat-icon">
                            <FiCalendar />
                        </div>
                    </div>

                    <div className="stat-value">
                        {preferences?.payoutDate
                            ? `Day ${preferences.payoutDate}`
                            : "—"}
                    </div>

                    <div className="stat-note">
                        Monthly payout day
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        <span>
                            Total Payouts
                        </span>

                        <div className="stat-icon">
                            <FiDollarSign />
                        </div>
                    </div>

                    <div className="stat-value">
                        {payouts.length}
                    </div>

                    <div className="stat-note">
                        Monthly payouts created
                    </div>
                </div>
            </div>

            <div className="dashboard-grid content-grid-2 section-gap">
                <div className="content-card">
                    <div className="card-title-row">
                        <div>
                            <h2 className="card-title">
                                Payout Preferences
                            </h2>

                            <p className="card-subtitle">
                                Set the monthly amount and payout day.
                            </p>
                        </div>
                    </div>

                    <div className="info-strip">
                        <FiInfo />

                        <span>
                            Your target salary is used to manage
                            your monthly payout from your FlowFund
                            wallet.
                        </span>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={
                            handleSavePreferences
                        }
                    >
                        <div className="form-group">
                            <label>
                                Target Monthly Salary
                            </label>

                            <div className="input-with-icon">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter target salary"
                                    min="1"
                                    value={
                                        targetSalary
                                    }
                                    onChange={(e) =>
                                        setTargetSalary(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <span className="currency-prefix">
                                    ₹
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Monthly Payout Day
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter day of month (1-31)"
                                min="1"
                                max="31"
                                value={payoutDate}
                                onChange={(e) =>
                                    setPayoutDate(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            <FiSave />

                            {saving
                                ? "Saving..."
                                : preferences
                                ? "Update Preferences"
                                : "Save Preferences"}
                        </button>
                    </form>
                </div>

                <div className="content-card">
                    <div className="card-title-row">
                        <div>
                            <h2 className="card-title">
                                Monthly Payout
                            </h2>

                            <p className="card-subtitle">
                                Create your monthly payout.
                            </p>
                        </div>
                    </div>

                    <div className="info-strip">
                        <FiInfo />

                        <span>
                            A payout can be created using your
                            saved monthly payout preferences.
                        </span>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={
                            handleCreatePayout
                        }
                        disabled={
                            creatingPayout ||
                            loading ||
                            !preferences
                        }
                        style={{
                            width: "100%"
                        }}
                    >
                        <FiDollarSign />

                        {creatingPayout
                            ? "Creating Payout..."
                            : "Create Monthly Payout"}
                    </button>

                    {!preferences &&
                        !loading && (
                            <div
                                className="stat-note"
                                style={{
                                    marginTop: "12px"
                                }}
                            >
                                Save your payout preferences
                                first.
                            </div>
                        )}
                </div>
            </div>

            <div className="content-card section-gap">
                <div className="card-title-row">
                    <div>
                        <h2 className="card-title">
                            Payout History
                        </h2>

                        <p className="card-subtitle">
                            Your previously created monthly payouts.
                        </p>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            loadPayoutData(true)
                        }
                        disabled={
                            loading ||
                            refreshing
                        }
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
                            Loading payout history...
                        </strong>

                        Please wait while we retrieve
                        your payout information.
                    </div>
                ) : payouts.length === 0 ? (
                    <div className="empty-state">
                        <strong>
                            No payouts found
                        </strong>

                        Your monthly payouts will
                        appear here.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>
                                        Payout ID
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {payouts.map(
                                    (payout) => (
                                        <tr
                                            key={
                                                payout.id
                                            }
                                        >
                                            <td>
                                                {payout.id ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <strong>
                                                    {formatAmount(
                                                        payout.amount
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                {payout.date ||
                                                    payout.payoutDate ||
                                                    "—"}
                                            </td>

                                            <td>
                                                <span className="status-badge">
                                                    {payout.status ||
                                                        "—"}
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