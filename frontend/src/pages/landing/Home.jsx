import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <div className="logo">
          Flow<span>Fund</span>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="nav-btn">
            User Login
          </Link>

          <Link to="/register" className="nav-btn register">
            User Register
          </Link>

          <Link to="/admin/login" className="nav-btn admin">
            Admin Login
          </Link>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-left">

          <h1>
            Smarter Monthly <span>Payouts</span> for Freelancers
          </h1>

          <p>
            FlowFund helps freelancers convert unpredictable payments into a
            stable monthly income using a secure virtual wallet system. Receive
            payments from clients, manage your balance, and schedule monthly
            payouts—all in one place.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>

          </div>

        </div>

        <div className="hero-right">

          <div className="wallet-card">

            <h3>Virtual Wallet</h3>

            <h2>₹ 52,800</h2>

            <div className="wallet-row">
              <span>Monthly Target</span>
              <strong>₹ 25,000</strong>
            </div>

            <div className="wallet-row">
              <span>Upcoming Payout</span>
              <strong>28 July</strong>
            </div>

            <div className="wallet-row">
              <span>Status</span>
              <strong className="success">
                Ready
              </strong>
            </div>

          </div>

        </div>

      </section>

      <section className="features">

        <div className="feature-card">
          <div className="icon">💼</div>
          <h3>Client Payments</h3>
          <p>
            Clients pay securely into your FlowFund virtual wallet.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">💳</div>
          <h3>Virtual Wallet</h3>
          <p>
            Track wallet balance, transactions and reserve funds easily.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">📅</div>
          <h3>Monthly Salary</h3>
          <p>
            Receive consistent monthly payouts even when client payments vary.
          </p>
        </div>

      </section>

      <footer>
        © 2026 FlowFund | MCA Final Year Project
      </footer>

    </div>
  );
}

export default Home;