
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Logout from "../components/Logout";

function Orders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        try {
            const response = await api.get("/orders");
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        GreenCraft
                    </h1>
                    <p className="text-sm text-slate-500">
                        My Orders
                    </p>
                </div>

                <Logout />
            </header>

            {/* Content */}
            <main className="p-6 max-w-6xl mx-auto">

                <button
                    onClick={() => navigate("/buyer")}
                    className="mb-6 text-slate-400 hover:text-white"
                >
                    ← Back to Marketplace
                </button>

                <h2 className="text-3xl font-bold mb-2">
                    My Orders
                </h2>

                <p className="text-slate-400 mb-8">
                    View your previous orders and their status.
                </p>

                {loading && (
                    <div className="text-center py-16 text-slate-400">
                        Loading orders...
                    </div>
                )}

                {error && (
                    <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                        <div className="text-5xl">
                            📦
                        </div>

                        <h3 className="text-xl font-semibold mt-5">
                            No orders yet
                        </h3>

                        <p className="text-slate-500 mt-2">
                            You haven't placed any orders yet.
                        </p>

                        <button
                            onClick={() => navigate("/buyer")}
                            className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}

                {!loading && orders.length > 0 && (
                    <div className="space-y-5">

                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                            >

                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Order ID
                                        </p>

                                        <p className="font-medium mt-1 break-all">
                                            {order.id}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm">
                                            {order.status}
                                        </span>

                                        <p className="text-xs text-slate-500 mt-2">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                </div>

                                {/* Products */}
                                <div className="py-5 space-y-4">

                                    {order.items?.map((item, index) => (
                                        <div
                                            key={`${item.productId}-${index}`}
                                            className="flex items-center gap-4"
                                        >

                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                                                    🌿
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <h3 className="font-medium">
                                                    {item.name}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    Rs. {item.price} × {item.quantity}
                                                </p>
                                            </div>

                                            <div className="font-semibold text-emerald-400">
                                                Rs. {(item.price * item.quantity).toFixed(2)}
                                            </div>

                                        </div>
                                    ))}

                                </div>

                                {/* Order Footer */}
                                <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Delivery Address
                                        </p>

                                        <p className="text-sm mt-1">
                                            {order.shippingAddress || "Not provided"}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-slate-500">
                                            Total
                                        </p>

                                        <p className="text-2xl font-bold text-emerald-400">
                                            Rs. {order.totalAmount}
                                        </p>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </main>
        </div>
    );
}

export default Orders;

