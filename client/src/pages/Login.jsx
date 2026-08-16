import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

function Login() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            login(
                response.data.token,
                response.data.user
            );

            const role = response.data.user.role.toLowerCase();

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "seller") {
                navigate("/seller");
            } else {
                navigate("/buyer");
            }

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-background-circle circle-one"></div>
            <div className="login-background-circle circle-two"></div>

            <div className="login-card">

                <div className="login-logo">
                    <div className="logo-icon">C</div>
                    <div>
                        <h1>Campus</h1>
                        <span>Marketplace</span>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Welcome back 👋</h2>
                    <p>Sign in to continue to your account</p>
                </div>

                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email</label>

                        <div className="input-wrapper">
                            <span>✉</span>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>

                        <div className="input-wrapper">
                            <span>🔒</span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className="login-error">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            "Sign In →"
                        )}
                    </button>

                </form>

                <div className="login-footer">
                    <span>New to Campus Marketplace?</span>

                    <button
                        onClick={() => navigate("/register")}
                    >
                        Create account
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Login;