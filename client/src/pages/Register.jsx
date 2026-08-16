import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("buyer");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            setMessage("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed."
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-white text-center">
                    Create Account
                </h1>

                <p className="text-slate-400 text-center mt-2 mb-8">
                    Join Campus Marketplace
                </p>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="text-sm text-slate-300">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full mt-2 px-4 py-3 rounded-xl
                            bg-slate-800 border border-slate-700
                            text-white outline-none
                            focus:border-indigo-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm text-slate-300">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full mt-2 px-4 py-3 rounded-xl
                            bg-slate-800 border border-slate-700
                            text-white outline-none
                            focus:border-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm text-slate-300">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full mt-2 px-4 py-3 rounded-xl
                            bg-slate-800 border border-slate-700
                            text-white outline-none
                            focus:border-indigo-500"
                            placeholder="Create a password"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="text-sm text-slate-300">
                            Register as
                        </label>

                        <div className="grid grid-cols-2 gap-3 mt-2">

                            <button
                                type="button"
                                onClick={() => setRole("buyer")}
                                className={`py-3 rounded-xl border transition ${
                                    role === "buyer"
                                        ? "bg-indigo-600 border-indigo-500 text-white"
                                        : "bg-slate-800 border-slate-700 text-slate-400"
                                }`}
                            >
                                Buyer
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("seller")}
                                className={`py-3 rounded-xl border transition ${
                                    role === "seller"
                                        ? "bg-indigo-600 border-indigo-500 text-white"
                                        : "bg-slate-800 border-slate-700 text-slate-400"
                                }`}
                            >
                                Seller
                            </button>

                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl
                        bg-indigo-600 hover:bg-indigo-500
                        text-white font-semibold transition"
                    >
                        Create Account
                    </button>

                </form>

                {message && (
                    <p className="text-center text-sm text-indigo-400 mt-5">
                        {message}
                    </p>
                )}

                <p className="text-center text-slate-500 text-sm mt-6">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/login")}
                        className="text-indigo-400 hover:text-indigo-300"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Register;