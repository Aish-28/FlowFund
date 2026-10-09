
import { useState } from "react";
import {
    FiActivity,
    FiBarChart2,
    FiChevronLeft,
    FiChevronRight,
    FiCreditCard,
    FiGrid,
    FiLogOut,
    FiMenu,
    FiSettings,
    FiUsers,
    FiX
} from "react-icons/fi";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    getName,
    logout
} from "../utils/auth";

import "./dashboard.css";

export default function DashboardLayout({
    children,
    title,
    subtitle,
    role,
    navItems = []
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navigate = useNavigate();

    const displayName =
        getName() ||
        (
            role === "ADMIN"
                ? "Administrator"
                : role === "CLIENT"
                ? "Client"
                : "Freelancer"
        );

    const iconMap = {
        dashboard: FiGrid,
        wallet: FiCreditCard,
        transactions: FiBarChart2,
        users: FiUsers,
        settings: FiSettings
    };

    const handleLogout = () => {
        logout();

        navigate(
            role === "ADMIN" ? "/admin/login" : "/login",
            {
                replace: true
            }
        );
    };

    return (
        <div
            className={`dashboard-shell ${
                collapsed ? "sidebar-collapsed" : ""
            }`}
        >
            <aside
                className={`dashboard-sidebar ${
                    mobileOpen ? "mobile-open" : ""
                }`}
            >
                <div className="sidebar-brand">
                    <Link
                        to="/"
                        className="dashboard-brand"
                    >
                        <span className="brand-mark">
                            <FiActivity />
                        </span>

                        {!collapsed && (
                            <span>FlowFund</span>
                        )}
                    </Link>

                    <button
                        className="mobile-close"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="sidebar-role">
                    <span>
                        {
                            role === "ADMIN"
                                ? "Administrator"
                                : role === "CLIENT"
                                ? "Client"
                                : "Freelancer"
                        }
                    </span>
                </div>

                <nav className="dashboard-nav">
                    {navItems.map((item) => {
                        const Icon =
                            iconMap[item.icon] || FiGrid;

                        return (
                            <Link
                                key={item.label}
                                to={item.to || item.path}
                                className={
                                    item.active ? "active" : ""
                                }
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon />

                                {!collapsed && (
                                    <span>{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        className="dashboard-logout"
                        onClick={handleLogout}
                    >
                        <FiLogOut />

                        {!collapsed && (
                            <span>Logout</span>
                        )}
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-left">
                        <button
                            className="sidebar-toggle"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label="Toggle sidebar"
                        >
                            {
                                collapsed
                                    ? <FiChevronRight />
                                    : <FiChevronLeft />
                            }
                        </button>

                        <button
                            className="mobile-menu"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <FiMenu />
                        </button>

                        <div>
                            <h1>{title}</h1>
                            <p>{subtitle}</p>
                        </div>
                    </div>

                    <div className="profile-chip">
                        <div className="profile-avatar">
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{displayName}</strong>
                            <span>{role}</span>
                        </div>
                    </div>
                </header>

                <section className="dashboard-content">
                    {children}
                </section>
            </main>
        </div>
    );
}
