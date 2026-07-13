import "./Auth.css";
import { Link } from "react-router-dom";

function Login(){
    return(
        <div className="auth-container">

            <div className="left-panel">
                <div className="overlay">
                    <h1>FlowFund</h1>
                    <h2>Welcome Back</h2>
                    <p>Login and continue your jouney...</p>
                </div>
            </div>
            
            <div className="right-panel">
                <div className="form-container">
                    <h2>Login</h2>
                    <p>Login into your FlowFund account to continue</p>

                    <form>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>

                        <button className="auth-btn">Login</button>
                    </form>

                    <p className="bottom-text">
                        Don't have an account?<Link to="/">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;