import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setlog }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/login", {
                username: email,
                password,
            });

            if (response.data.success) {
                setlog(true);
                navigate("/add-info");
            } else {
                setError("Invalid email or password.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid credentials or user does not exist.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome back</h2>
                <p className="subtext">Please enter your details to sign in</p>

                <label>Email</label>
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />

                <label>Password</label>
                <div className="password-container">
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                {error && <p className="error-text">{error}</p>} {/* Show error message if login fails */}

                <button 
                    className="sign-in-btn" 
                    onClick={handleLogin} 
                    disabled={!email || !password} // Disable button if inputs are empty
                >
                    Sign In
                </button>

                <p className="signup-text">Don't have an account? <NavLink to="/sign-up">Sign up</NavLink></p>
            </div>
        </div>
    );
}
