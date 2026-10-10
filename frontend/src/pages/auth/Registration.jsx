
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";
import { registerUser } from "../../services/authService";

function Registration() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phNo, setPhNo] = useState("");
    const [role, setRole] = useState("Freelancer");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const pattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

        if (!pattern.test(password)) {
            setError(
                "Password must be 8–20 characters and include uppercase, lowercase, a number, and a special character."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!/^\d{10}$/.test(phNo)) {
            setError("Enter a valid 10-digit phone number.");
            return;
        }

        try {
            setLoading(true);

            await registerUser({
                name: name.trim(),
                email: email.trim(),
                phNo: phNo,
                password: password,
                confirmPassword: confirmPassword,
                role: role.toUpperCase()
            });

            alert("Registration successful! Please log in.");
            navigate("/login", { replace: true });
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="left-panel">
                <div className="overlay">
                    <h1>FlowFund</h1>
                    <h2>Start Your Stable Income Journey Now...</h2>
                    <p>
                        Create your wallet, receive client payments securely,
                        and enjoy predictable monthly payouts.
                    </p>
                </div>
            </div>

            <div className="right-panel">
                <div className="form-container">
                    <h2>Create Account</h2>
                    <p>Create your FlowFund account to continue</p>

                    {error && (
                        <div className="error-message dashboard-message" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="phNo">Phone Number</label>
                            <input
                                id="phNo"
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Enter your 10-digit phone number"
                                value={phNo}
                                onChange={(e) =>
                                    setPhNo(e.target.value.replace(/\D/g, "").slice(0, 10))
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Freelancer">Freelancer</option>
                                <option value="Client">Client</option>
                            </select>
                        </div>

                        <div className="password-field">
                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="password-field">
                            <div className="input-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button className="auth-btn" type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>

                    <p className="bottom-text">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registration;
