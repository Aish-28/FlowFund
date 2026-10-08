import { useEffect, useState } from "react";
import {
    FiCreditCard,
    FiInfo,
    FiRefreshCw,
    FiSend
} from "react-icons/fi";

import DashboardLayout from "../../components/DashboardLayout";
import { apiRequest } from "../../services/api";
import { getUserId } from "../../utils/auth";

import "./dashboardPages.css";

function ClientDashboard() {

    const userId = getUserId();

    const [wallet, setWallet] = useState(null);
    const [payments, setPayments] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [freelancerId, setFreelancerId] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadDashboardData = async () => {

        if (!userId) {
            setError(
                "User session not found. Please login again."
            );

            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const [
                walletData,
                paymentData,
                transactionData
            ] = await Promise.all([
                apiRequest(`/wallets/user/${userId}`),
                apiRequest(`/payments/client/${userId}`),
                apiRequest(`/transactions/user/${userId}`)
            ]);

            setWallet(walletData);

            setPayments(
                Array.isArray(paymentData)
                    ? paymentData
                    : []
            );

            setTransactions(
                Array.isArray(transactionData)
                    ? transactionData
                    : []
            );

        } catch (err) {

            setError(
                err.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const handlePayment = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (!freelancerId.trim()) {
            setError(
                "Please enter the freelancer ID."
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError(
                "Please enter a valid payment amount."
            );
            return;
        }

        if (freelancerId.trim() === userId) {
            setError(
                "You cannot make a payment to yourself."
            );
            return;
        }

        try {

            setPaymentLoading(true);

            await apiRequest(
                `/payments/client/${userId}/freelancer/${freelancerId.trim()}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        amount: Number(amount)
                    })
                }
            );

            setSuccess(
                "Payment successful. The freelancer wallet has been credited."
            );

            setFreelancerId("");
            setAmount("");

            await loadDashboardData();

        } catch (err) {

            setError(
                err.message ||
                "Payment failed."
            );

        } finally {

            setPaymentLoading(false);

        }
    };

    const formatAmount = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "₹ —";
        }

        return `₹ ${Number(value).toLocaleString("en-IN")}`;
    };

    const formatDate = (value) => {

        if (!value) {
            return "—";
        }

        return new Date(value).toLocaleDateString(
            "en-IN"
        );
    };

    return (
        <DashboardLayout
            role="CLIENT"
            title="Client Dashboard"
            subtitle="Manage your simulated payment workflow."
            navItems={[
                {
                    label: "Dashboard",
                    to: "/client-dashboard",
                    icon: "dashboard",
                    active: true
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

            {success && (
                <div className="success-message dashboard-message">
                    <FiInfo />
                    <span>{success}</span>
                </div>
            )}

            <div className="dashboard-grid stats-grid">

                <Stat
                    icon={<FiCreditCard />}
                    label="Wallet Balance"
                    value={
                        loading
                            ? "Loading..."
                            : formatAmount(
                                wallet?.balance
                            )
                    }
                    note="Available simulated balance"
                />

                <Stat
                    icon={<FiCreditCard />}
                    label="Payments"
                    value={
                        loading
                            ? "Loading..."
                            : payments.length
                    }
                    note="Payments made"
                />

                <Stat
                    icon={<FiSend />}
                    label="Transactions"
                    value={
                        loading
                            ? "Loading..."
                            : transactions.length
                    }
                    note="Wallet transactions"
                />

                <Stat
                    icon={<FiCreditCard />}
                    label="Wallet Status"
                    value={
                        loading
                            ? "Loading..."
                            : wallet?.status || "—"
                    }
                    note="Current wallet status"
                />

            </div>

            <div
                className="dashboard-grid content-grid-2"
                id="payments"
            >

                <section className="content-card">

                    <div className="card-title-row">

                        <div>
                            <h2 className="card-title">
                                Pay a Freelancer
                            </h2>

                            <p className="card-subtitle">
                                Send a simulated payment from your wallet.
                            </p>
                        </div>

                    </div>

                    <div className="info-strip">

                        <FiInfo />

                        <span>
                            Payments are simulated using
                            your FlowFund wallet balance.
                        </span>

                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handlePayment}
                    >

                        <div className="form-group">

                            <label htmlFor="freelancerId">
                                Freelancer ID
                            </label>

                            <input
                                id="freelancerId"
                                className="form-control"
                                value={freelancerId}
                                onChange={(e) =>
                                    setFreelancerId(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter freelancer UUID"
                                disabled={paymentLoading}
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="paymentAmount">
                                Amount
                            </label>

                            <div className="input-with-icon">

                                <input
                                    id="paymentAmount"
                                    className="form-control"
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter amount"
                                    disabled={paymentLoading}
                                />

                                <span className="currency-prefix">
                                    ₹
                                </span>

                            </div>

                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={paymentLoading}
                        >
                            <FiSend />

                            {
                                paymentLoading
                                    ? "Processing..."
                                    : "Make Payment"
                            }
                        </button>

                    </form>

                </section>

                <section
                    className="content-card"
                    id="wallet"
                >

                    <div className="card-title-row">

                        <div>
                            <h2 className="card-title">
                                Wallet
                            </h2>

                            <p className="card-subtitle">
                                Your current simulated wallet balance.
                            </p>
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={
                                loadDashboardData
                            }
                            disabled={loading}
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>

                    </div>

                    <div className="wallet-summary-box">

                        <div>

                            <span>
                                Available Balance
                            </span>

                            <strong>
                                {
                                    loading
                                        ? "Loading..."
                                        : formatAmount(
                                            wallet?.balance
                                        )
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Wallet Status
                            </span>

                            <strong>
                                {
                                    loading
                                        ? "Loading..."
                                        : wallet?.status ||
                                          "—"
                                }
                            </strong>

                        </div>

                    </div>

                </section>

            </div>

            <section className="content-card section-gap">

                <div className="card-title-row">

                    <div>

                        <h2 className="card-title">
                            Payment History
                        </h2>

                        <p className="card-subtitle">
                            Payments made from your client account.
                        </p>

                    </div>

                </div>

                {
                    payments.length === 0
                        ? (
                            <div className="empty-state">
                                <strong>
                                    No payments yet
                                </strong>

                                Your completed payments
                                will appear here.
                            </div>
                        )
                        : (
                            <div className="table-wrap">

                                <table className="data-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                Freelancer
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
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            payments.map(
                                                (payment) => (
                                                    <tr
                                                        key={
                                                            payment.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                payment.freelancer?.name ||
                                                                payment.freelancerName ||
                                                                "Freelancer"
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                formatAmount(
                                                                    payment.amount
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                formatDate(
                                                                    payment.date
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                payment.time ||
                                                                "—"
                                                            }
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={
                                                                    `status-badge ${
                                                                        payment.status ===
                                                                        "SUCCESS"
                                                                            ? "status-success"
                                                                            : payment.status ===
                                                                              "FAILED"
                                                                            ? "status-danger"
                                                                            : "status-warning"
                                                                    }`
                                                                }
                                                            >
                                                                {
                                                                    payment.status ||
                                                                    "—"
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>
                                                )
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>
                        )
                }

            </section>

            <section className="content-card section-gap">

                <div className="card-title-row">

                    <div>

                        <h2 className="card-title">
                            Transaction History
                        </h2>

                        <p className="card-subtitle">
                            Wallet debit, credit and transfer records.
                        </p>

                    </div>

                </div>

                {
                    transactions.length === 0
                        ? (
                            <div className="empty-state">
                                <strong>
                                    No transactions yet
                                </strong>

                                Your wallet transactions
                                will appear here.
                            </div>
                        )
                        : (
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

                                            <th>
                                                Time
                                            </th>

                                            <th>
                                                Remarks
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            transactions.map(
                                                (transaction) => (
                                                    <tr
                                                        key={
                                                            transaction.id
                                                        }
                                                    >

                                                        <td>

                                                            <span
                                                                className={
                                                                    `status-badge ${
                                                                        transaction.type ===
                                                                        "DEBIT"
                                                                            ? "status-danger"
                                                                            : transaction.type ===
                                                                              "CREDIT"
                                                                            ? "status-success"
                                                                            : "status-warning"
                                                                    }`
                                                                }
                                                            >
                                                                {
                                                                    transaction.type ||
                                                                    "—"
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>
                                                            {
                                                                formatAmount(
                                                                    transaction.amount
                                                                )
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                formatDate(
                                                                    transaction.date
                                                                )
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
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>
                        )
                }

            </section>

        </DashboardLayout>
    );
}

function Stat({
    icon,
    label,
    value,
    note
}) {

    return (
        <div className="stat-card">

            <div className="stat-label">

                <span>
                    {label}
                </span>

                <span className="stat-icon">
                    {icon}
                </span>

            </div>

            <div className="stat-value">
                {value}
            </div>

            <div className="stat-note">
                {note}
            </div>

        </div>
    );
}

export default ClientDashboard;