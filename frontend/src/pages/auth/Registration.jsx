import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Registration(){

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[role,setRole]=useState("Freelancer");
    const[password,setPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");

    const[showPassword,setShowPassword]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(!email.includes("@")){
            alert("Email must contain @");
            return;
        }

        const pattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

        if(!pattern.test(password)){
            alert("Password must be 8-20 characters including uppercase, lowercase, number and special character");
            return;
        }

        if(password!==confirmPassword){
            alert("Please enter same password");
            return
        }
    }

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

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" 
                                   placeholder="Enter your full name"
                                   value={name}
                                   onChange={(e)=>setName(e.target.value)} 
                                   required/>
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input type="email" 
                                   placeholder="Enter your email" 
                                   value={email}
                                   onChange={(e)=>setEmail(e.target.value)}
                                   required/>
                        </div>

                        <div className="input-group">
                            <label>Role</label>
                            <select value={role}
                                    onChange={(e)=>setRole(e.target.value)}>

                                <option value="Freelancer">Freelancer</option>
                                <option value="Client">Client</option>
                            </select>
                        </div>

                        <div className="password-field">
                            <div className="input-group">
                                <label>Password</label>
                                <input type={showPassword ? "text" : "password"} 
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    required />
                                    <span className="password-toggle" 
                                          onClick={()=>setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                            </div>
                        </div>

                        <div className="password-field">
                            <div className="input-group">
                                <label>Confirm Password</label>
                                <input type={showPassword ? "text" : "password"} 
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e)=>setConfirmPassword(e.target.value)}
                                    required />
                                    <span className="password-toggle" 
                                          onClick={()=>setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                            </div>
                        </div>

                        <button className="auth-btn" type="submit">Register</button>
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