
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function MyOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/orders");

            setOrders(response.data);
        } catch (error) {
            console.error("ORDER LOAD ERROR:", error);

            setError(
                error.response?.data?.message ||
                    "Failed to load your orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

            case "Confirmed":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "Shipped":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";

            case "Delivered":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

            case "Cancelled":
                return "bg-red-500/10 text-red-400 border-red-500/20";

            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-xl">
                        G
                    </div>

                    <div>
                        <h1 className="font-bold">
                            GreenCraft
                        </h1>

                        <p className="text-xs text-slate-500">
                            Marketplace
                        </p>
                    </div>

                </div>

                <button
                    onClick={() => navigate("/buyer")}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                >
                    ← Back to Marketplace
                </button>

            </header>

            {/* Main */}
            <main className="p-6 max-w-6xl mx-auto">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        My Orders 📦
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Track your orders and check their current status.
                    </p>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-16 text-slate-400">
                        Loading your orders...
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-6">

                        <p>{error}</p>

                        <button
                            onClick={loadOrders}
                            className="mt-4 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* No orders */}
                {!loading &&
                    !error &&
                    orders.length === 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                            <div className="text-6xl">
                                📦
                            </div>

                            <h2 className="text-xl font-semibold mt-5">
                                No orders yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Your placed orders will appear here.
                            </p>

                            <button
                                onClick={() => navigate("/buyer")}
                                className="mt-6 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                            >
                                Start Shopping
                            </button>

                        </div>
                    )}

                {/* Orders */}
                {!loading &&
                    !error &&
                    orders.length > 0 && (
                        <div className="space-y-6">

                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                                >

                                    {/* Order Header */}
                                    <div className="p-6 border-b border-slate-800">

                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                            <div>

                                                <p className="text-xs text-slate-500">
                                                    Order ID
                                                </p>

                                                <p className="font-medium mt-1 break-all">
                                                    {order.id}
                                                </p>

                                                <p className="text-sm text-slate-500 mt-2">
                                                    {order.createdAt
                                                        ? new Date(
                                                              order.createdAt
                                                          ).toLocaleString()
                                                        : ""}
                                                </p>

                                            </div>

                                            <div
                                                className={`px-4 py-2 rounded-xl border font-semibold text-sm ${getStatusStyle(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status || "Pending"}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Tracking */}
                                    <div className="p-6 border-b border-slate-800">

                                        <h3 className="font-semibold mb-6">
                                            Order Tracking
                                        </h3>

                                        <div className="grid grid-cols-5 gap-2">

                                            {[
                                                "Pending",
                                                "Confirmed",
                                                "Shipped",
                                                "Delivered",
                                            ].map((status, index) => {

                                                const statuses = [
                                                    "Pending",
                                                    "Confirmed",
                                                    "Shipped",
                                                    "Delivered",
                                                ];

                                                const currentIndex =
                                                    statuses.indexOf(
                                                        order.status
                                                    );

                                                const active =
                                                    currentIndex >= index;

                                                return (
                                                    <div
                                                        key={status}
                                                        className="text-center"
                                                    >

                                                        <div
                                                            className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center ${
                                                                active
                                                                    ? "bg-emerald-600"
                                                                    : "bg-slate-800"
                                                            }`}
                                                        >
                                                            {active
                                                                ? "✓"
                                                                : index + 1}
                                                        </div>

                                                        <p
                                                            className={`text-xs mt-2 ${
                                                                active
                                                                    ? "text-emerald-400"
                                                                    : "text-slate-500"
                                                            }`}
                                                        >
                                                            {status}
                                                        </p>

                                                    </div>
                                                );
                                            })}

                                        </div>

                                        {order.status === "Cancelled" && (
                                            <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                                This order has been cancelled.
                                            </div>
                                        )}

                                    </div>

                                    {/* Items */}
                                    <div className="p-6">

                                        <h3 className="font-semibold mb-5">
                                            Items
                                        </h3>

                                        <div className="space-y-4">

                                            {order.items?.map(
                                                (item, index) => (
                                                    <div
                                                        key={`${item.productId}-${index}`}
                                                        className="flex items-center gap-4"
                                                    >

                                                        {item.imageUrl ? (
                                                            <img
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                                alt={
                                                                    item.name
                                                                }
                                                                className="w-16 h-16 rounded-xl object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl">
                                                                🌿
                                                            </div>
                                                        )}

                                                        <div className="flex-1">

                                                            <p className="font-medium">
                                                                {item.name ||
                                                                    item.productName ||
                                                                    "Product"}
                                                            </p>

                                                            <p className="text-sm text-slate-500">
                                                                Rs.{" "}
                                                                {item.price}{" "}
                                                                ×{" "}
                                                                {item.quantity}
                                                            </p>

                                                        </div>

                                                        <p className="font-semibold text-emerald-400">
                                                            Rs.{" "}
                                                            {(
                                                                Number(
                                                                    item.price
                                                                ) *
                                                                Number(
                                                                    item.quantity
                                                                )
                                                            ).toFixed(2)}
                                                        </p>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                        {/* Total */}
                                        <div className="border-t border-slate-800 mt-6 pt-5 flex justify-between items-center">

                                            <span className="text-slate-400">
                                                Total
                                            </span>

                                            <span className="text-2xl font-bold text-emerald-400">
                                                Rs. {order.totalAmount}
                                            </span>

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

export default MyOrders;

