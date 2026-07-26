import "./Auth.css";
import { Link } from "react-router-dom";

function AdminLogin() {
  return (
    <div className="auth-container">

      <div className="left-panel admin-panel">
        <div className="overlay">
          <h1>FlowFund</h1>

          <h2>Administrator Portal</h2>

          <p>
            Manage users, monitor wallets, review transactions and oversee the
            entire FlowFund platform securely.
          </p>
        </div>
      </div>

      <div className="right-panel">

        <div className="form-container">

          <h2>Admin Login</h2>

          <p>Authorized Personnel Only</p>

          <form>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Admin Email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
              />
            </div>

            <button className="auth-btn">
              Login
            </button>

          </form>

          <div className="bottom-text">
            <Link to="/">← Back to Home</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;