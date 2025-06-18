import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp({ setlog }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSignUp = async () => {
        let valid = true;
        setError("");

        if (!email || !validateEmail(email)) {
            setEmailError(true);
            valid = false;
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            valid = false;
        }

        if (!valid) {
            setError("Please fix the highlighted errors.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/signup", {
                username: email,
                password,
            });

            if (response.data.success) {
                setlog(true);
                navigate("/add-info");
            } else {
                setError(response.data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("Error signing up. Please try again.");
        }
    };

    return (
        <div className="signup-container">
            <div className="login-box">
                <h2>Welcome</h2>
                <p className="subtext">Please enter your details to sign up</p>

                <label>Email</label>
                <input
                    type="email"
                    placeholder={emailError ? "Enter a valid email" : "Enter your email"}
                    className={emailError ? "input-error" : ""}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(false);
                    }}
                />

                <label>Password</label>
                <div className="password-container">
                    <input
                        type="password"
                        placeholder={passwordError ? "Min 6 characters required" : "Enter your password (More than 6 characters)"}
                        className={passwordError ? "input-error" : ""}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(false);
                        }}
                    />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button
                    className="sign-in-btn"
                    onClick={handleSignUp}
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
