import {
    FiArrowRight,
    FiLogIn,
    FiMenu,
    FiX
} from "react-icons/fi";

import {
    Link
} from "react-router-dom";

import {
    useState
} from "react";

import Logo from "./Logo";

import "./topNavbar.css";

export default function TopNavbar() {

    const [open, setOpen] =
        useState(false);

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <header className="site-nav">

            <div className="container nav-inner">

                <Logo />

                <button
                    className="mobile-menu-btn"
                    onClick={() =>
                        setOpen(!open)
                    }
                    aria-label="Toggle navigation"
                >
                    {
                        open
                            ? <FiX />
                            : <FiMenu />
                    }
                </button>

                <nav
                    className={
                        `nav-links ${
                            open
                                ? "nav-open"
                                : ""
                        }`
                    }
                >

                    <a
                        href="#home"
                        onClick={closeMenu}
                    >
                        Home
                    </a>

                    <a
                        href="#how-it-works"
                        onClick={closeMenu}
                    >
                        How it works
                    </a>

                    <a
                        href="#features"
                        onClick={closeMenu}
                    >
                        Features
                    </a>

                    <Link
                        to="/login"
                        onClick={closeMenu}
                    >
                        <FiLogIn />
                        Login
                    </Link>

                    <Link
                        className="nav-register"
                        to="/register"
                        onClick={closeMenu}
                    >
                        Get started
                        <FiArrowRight />
                    </Link>

                    <Link
                        className="nav-admin"
                        to="/admin/login"
                        onClick={closeMenu}
                    >
                        Admin
                    </Link>

                </nav>

            </div>

        </header>
    );
}