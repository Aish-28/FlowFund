import { useEffect, useState } from "react";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiShield,
    FiSave,
    FiRefreshCw
} from "react-icons/fi";

import DashboardLayout from "../components/DashboardLayout";
import { apiRequest } from "../services/api";
import { getRole, saveAuth } from "../utils/auth";
import "./Profile.css";

export default function Profile() {
    const role = getRole();

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [phNo, setPhNo] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isClient = role === "CLIENT";

    const navItems = isClient
        ? [
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
                icon: "transactions"
            },
            {
                label: "Profile",
                to: "/profile",
                icon: "settings",
                active: true
            }
        ]
        : [
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
                icon: "wallet"
            },
            {
                label: "Transactions",
                to: "/freelancer-transactions",
                icon: "transactions"
            },
            {
                label: "Profile",
                to: "/profile",
                icon: "settings",
                active: true
            }
        ];

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await apiRequest("/users/profile");

            setProfile(data);
            setName(data.name || "");
            setPhNo(data.phNo || "");
        } catch (err) {
            setError(err.message || "Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const trimmedName = name.trim();
        const trimmedPhone = phNo.trim();

        if (trimmedName.length < 3 || trimmedName.length > 50) {
            setError("Name must contain between 3 and 50 characters.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
            setError("Enter a valid 10-digit Indian mobile number.");
            return;
        }

        try {
            setSaving(true);

            const updatedProfile = await apiRequest("/users/profile", {
                method: "PUT",
                body: JSON.stringify({
                    name: trimmedName,
                    phNo: trimmedPhone
                })
            });

            setProfile(updatedProfile);
            setName(updatedProfile.name || "");
            setPhNo(updatedProfile.phNo || "");

            // Update the stored name without changing the token or role.
            saveAuth({
                name: updatedProfile.name
            });

            setSuccess("Your profile has been updated successfully.");

        } catch (err) {
            setError(err.message || "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout
            title="My Profile"
            subtitle="View and manage your personal information."
            role={role}
            navItems={navItems}
        >
            <div className="profile-page">
                <div className="profile-heading">
                    <div className="profile-avatar">
                        <FiUser />
                    </div>

                    <div>
                        <h2>{profile?.name || "My Profile"}</h2>
                        <p>Manage your FlowFund account details.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="profile-message">
                        Loading your profile...
                    </div>
                ) : error && !profile ? (
                    <div className="profile-message profile-error">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="profile-secondary-button"
                            onClick={loadProfile}
                        >
                            <FiRefreshCw /> Retry
                        </button>
                    </div>
                ) : (
                    <div className="profile-card">
                        <div className="profile-card-heading">
                            <div>
                                <h3>Personal Information</h3>
                                <p>Update your name and contact number.</p>
                            </div>
                            <FiUser className="profile-heading-icon" />
                        </div>

                        {error && (
                            <div className="profile-alert profile-alert-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="profile-alert profile-alert-success">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="profile-field">
                                <label htmlFor="profile-name">
                                    Full Name
                                </label>
                                <div className="profile-input-wrapper">
                                    <FiUser />
                                    <input
                                        id="profile-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        minLength={3}
                                        maxLength={50}
                                        required
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-user-id">User ID</label>
                                <div className="profile-input-wrapper profile-readonly">
                                    <FiShield />
                                    <input
                                        id="profile-user-id"
                                        type="text"
                                        value={profile?.userId || profile?.id || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-email">
                                    Email Address
                                </label>
                                <div className="profile-input-wrapper profile-readonly">
                                    <FiMail />
                                    <input
                                        id="profile-email"
                                        type="email"
                                        value={profile?.email || ""}
                                        readOnly
                                    />
                                </div>
                                <small>Email address cannot be changed here.</small>
                            </div>

                            <div className="profile-field">
                                <label htmlFor="profile-phone">
                                    Phone Number
                                </label>
                                <div className="profile-input-wrapper">
                                    <FiPhone />
                                    <input
                                        id="profile-phone"
                                        type="tel"
                                        value={phNo}
                                        onChange={(event) =>
                                            setPhNo(event.target.value)
                                        }
                                        maxLength={10}
                                        pattern="[6-9][0-9]{9}"
                                        title="Enter a valid 10-digit Indian mobile number"
                                        required
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            <div className="profile-field">
                                <label>Account Role</label>
                                <div className="profile-input-wrapper profile-readonly">
                                    <FiShield />
                                    <input
                                        type="text"
                                        value={profile?.role || role || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="profile-field">
                                <label>Account Status</label>
                                <div className="profile-status-row">
                                    <span
                                        className={`profile-status ${
                                            profile?.status === "ACTIVE"
                                                ? "profile-status-active"
                                                : "profile-status-other"
                                        }`}
                                    >
                                        {profile?.status || "Unavailable"}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="profile-secondary-button"
                                    onClick={loadProfile}
                                    disabled={saving}
                                >
                                    <FiRefreshCw /> Reset
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-button"
                                    disabled={saving}
                                >
                                    <FiSave />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
