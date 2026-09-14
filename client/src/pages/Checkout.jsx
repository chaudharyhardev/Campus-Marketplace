
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Logout from "../components/Logout";

function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
    });

    const [error, setError] = useState("");

    // Load cart
    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        if (savedCart.length === 0) {
            navigate("/cart");
            return;
        }

        setCart(savedCart);
    }, [navigate]);

    // Handle input
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Calculate total
    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * item.quantity,
        0
    );

    // Place order
    const placeOrder = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.fullName ||
            !form.phone ||
            !form.address ||
            !form.city
        ) {
            setError("Please fill all delivery details.");
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                items: cart.map((item) => ({
                    productId: item.id,
                    productName: item.name,
                    price: Number(item.price),
                    quantity: item.quantity,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName,
                })),

                totalAmount: total,

                fullName: form.fullName,
                phone: form.phone,
                address: form.address,
                city: form.city,
            };

            console.log("Sending order:", orderData);

            const response = await api.post(
                "/orders",
                orderData
            );

            console.log("Order response:", response.data);

            // Clear cart
            localStorage.removeItem("cart");

            // Go to order success page
            navigate("/order-success");

        } catch (error) {
            console.error("ORDER ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to place order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        GreenCraft
                    </h1>

                    <p className="text-sm text-slate-500">
                        Checkout
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate("/cart")}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                    >
                        ← Cart
                    </button>

                    <Logout />

                </div>

            </header>

            {/* Main */}
            <main className="p-6 max-w-6xl mx-auto">

                <h2 className="text-3xl font-bold mb-8">
                    Checkout
                </h2>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={placeOrder}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >

                    {/* Delivery Details */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <h3 className="text-xl font-semibold mb-6">
                            Delivery Information
                        </h3>

                        <div className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label className="text-sm text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-sm text-slate-300">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="98XXXXXXXX"
                                    required
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-sm text-slate-300">
                                    Delivery Address
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    placeholder="Enter your delivery address"
                                    rows="4"
                                    required
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="text-sm text-slate-300">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Kathmandu"
                                    required
                                    className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
                                />
                            </div>

                        </div>

                    </div>

                    {/* Order Summary */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">

                        <h3 className="text-xl font-semibold mb-5">
                            Order Summary
                        </h3>

                        {/* Products */}
                        <div className="space-y-4">

                            {cart.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex justify-between gap-3"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {item.name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {item.quantity} × Rs. {item.price}
                                        </p>

                                    </div>

                                    <p className="text-emerald-400 font-medium">
                                        Rs.{" "}
                                        {Number(item.price) *
                                            item.quantity}
                                    </p>

                                </div>

                            ))}

                        </div>

                        <div className="border-t border-slate-800 my-5"></div>

                        {/* Total */}
                        <div className="flex justify-between text-xl font-bold">

                            <span>
                                Total
                            </span>

                            <span className="text-emerald-400">
                                Rs. {total}
                            </span>

                        </div>

                        {/* Place Order */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                        >
                            {loading
                                ? "Placing Order..."
                                : "Place Order"}
                        </button>

                    </div>

                </form>

            </main>
        </div>
    );
}

export default Checkout;

