import { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../services/authService";

function Login(){

    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [role,setRole]=useState("Freelancer");

    const[showPassword,setShowPassword]=useState(false);

    const navigate=useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("role", data.role);

            console.log("Login successful:", data);

            if (data.role === "FREELANCER") {
                navigate("/freelancer-dashboard");
            } else if (data.role === "CLIENT") {
                navigate("/client-dashboard");
            }

        } catch (error) {
            console.error("Login failed:", error);
        }
    };

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

                    <div className="role-toggle">
                        <button
                            type="button"
                            className={role==="Freelancer"?"active-role":""}
                            onClick={()=>setRole("Freelancer")}
                        >Freelancer</button>

                        <button
                            type="button"
                            className={role==="Client"?"active-role":""}
                            onClick={()=>setRole("Client")}
                        >Client</button>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" 
                                   placeholder="Enter your email" 
                                   value={email}
                                   onChange={(e)=>setEmail(e.target.value)}
                                   required/>
                        </div>

                        <div className="password-field">
                            <div className="input-group">
                                <label>Password</label>
                                <input type={showPassword ? "text" : "password"} 
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required/>
                                    <span className="password-toggle" 
                                            onClick={()=>setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                        </span>
                            </div>
                        </div>

                        <button className="auth-btn" type="submit">Login</button>
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