import { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/adminService";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginAdmin(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("role", data.role);

            console.log("Admin login successful:", data);

            navigate("/admin-dashboard");
        } catch (error) {
            console.error("Admin login failed:", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="left-panel admin-panel">
                <div className="overlay">
                    <h1>FlowFund</h1>

                    <h2>Welcome to FlowFund</h2>

                    <p>
                        Your platform for smarter monthly payouts
                        and seamless wallet management.
                    </p>

                    <p>
                        Sign in to the administrator portal to manage
                        users, monitor transactions, and oversee the
                        FlowFund platform securely.
                    </p>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-container">
                    <h2>Admin Login</h2>

                    <p>Authorized Personnel Only</p>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter Admin Email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button className="auth-btn" type="submit">
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