import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";

function Registration(){

    const [role,setRole]=useState("Freelancer");
    return(
        <div className="auth-container">

            <div className="left-panel">
                <div className="overlay">
                    <h1>FlowFund</h1>
                    <h2>Start Your Stable Income Journey Now...</h2>
                    <p>Create your wallet, receive client payments securely,and enjoy 
                        predictable monthly payouts
                    </p>
                </div>
            </div>
            
            <div className="right-panel">
                <div className="form-container">
                    <h2>Create Account</h2>
                    <p>Create your FlowFund account to continue</p>

                    <form>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your full name" />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" placeholder="Enter your email" />
                        </div>

                        <div className="input-group">
                            <label>Role</label>
                            <select value={role}
                                    onChange={(e)=>setRole(e.target.value)}>

                                <option value="Freelancer">Freelancer</option>
                                <option value="Client">Client</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" placeholder="Enter your password" />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input type="password" placeholder="Confirm Password" />
                        </div>

                        <button className="auth-btn">Register</button>
                    </form>

                    <p className="bottom-text">
                        Already have an account?<Link to="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registration;