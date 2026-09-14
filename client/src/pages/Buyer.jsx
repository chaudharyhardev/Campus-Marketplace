
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Logout from "../components/Logout";

function Buyer() {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    const menuItems = [
        "Dashboard",
        "Orders"
    ];

    // =========================
    // LOAD PRODUCTS
    // =========================
    const loadProducts = async () => {
        try {
            setLoading(true);

            const response = await api.get("/products");

            setProducts(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOAD BUYER ORDERS
    // =========================
    const loadOrders = async () => {
        try {
            setOrdersLoading(true);
            setOrdersError("");

            const response = await api.get("/orders");

            setOrders(response.data);
        } catch (error) {
            console.error(error);

            setOrdersError(
                error.response?.data?.message ||
                "Failed to load orders."
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (activeMenu === "Orders") {
            loadOrders();
        }
    }, [activeMenu]);

    // =========================
    // ADD TO CART
    // =========================
    const addToCart = (product) => {
        const existingCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = existingCart.find(
            (item) => item.id === product.id
        );

        let updatedCart;

        if (existingProduct) {
            updatedCart = existingCart.map((item) =>
                item.id === product.id
                    ? {
                        ...item,
                        quantity: Math.min(
                            item.quantity + 1,
                            item.stock
                        )
                    }
                    : item
            );
        } else {
            updatedCart = [
                ...existingCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        setMessage("Product added to cart.");

        setTimeout(() => {
            setMessage("");
        }, 2000);
    };

    // =========================
    // TRACKING COMPONENT
    // =========================
    const OrderTracking = ({ status }) => {
        const steps = [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered"
        ];

        const cancelled = status === "Cancelled";

        const currentIndex = steps.indexOf(status);

        return (
            <div className="mt-6">

                <div className="flex items-center justify-between">

                    {steps.map((step, index) => {

                        const completed =
                            !cancelled &&
                            currentIndex >= index;

                        const active =
                            !cancelled &&
                            currentIndex === index;

                        return (
                            <div
                                key={step}
                                className="flex-1 flex flex-col items-center relative"
                            >

                                {/* Line */}
                                {index !== 0 && (
                                    <div
                                        className={`absolute right-1/2 top-5 w-full h-1 ${
                                            completed
                                                ? "bg-emerald-500"
                                                : "bg-slate-700"
                                        }`}
                                    />
                                )}

                                {/* Circle */}
                                <div
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${
                                        completed
                                            ? "bg-emerald-500 border-emerald-400 text-white"
                                            : "bg-slate-800 border-slate-700 text-slate-500"
                                    } ${
                                        active
                                            ? "ring-4 ring-emerald-500/20"
                                            : ""
                                    }`}
                                >
                                    {completed ? "✓" : index + 1}
                                </div>

                                {/* Text */}
                                <p
                                    className={`text-xs mt-3 text-center ${
                                        completed
                                            ? "text-emerald-400"
                                            : "text-slate-500"
                                    }`}
                                >
                                    {step}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Cancelled */}
                {cancelled && (
                    <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                        ❌ This order has been cancelled.
                    </div>
                )}

                {/* Current Status */}
                {!cancelled && (
                    <div className="mt-5 text-center">
                        <p className="text-xs text-slate-500">
                            Current Status
                        </p>

                        <p className="text-lg font-semibold text-emerald-400 mt-1">
                            {status || "Pending"}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* =========================
                SIDEBAR
            ========================= */}
            <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">

                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">

                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-xl">
                        G
                    </div>

                    <div className="ml-3">
                        <h1 className="font-bold">
                            GreenCraft
                        </h1>

                        <p className="text-xs text-slate-500">
                            Marketplace
                        </p>
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-2">

                    {menuItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveMenu(item)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition ${
                                activeMenu === item
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {item === "Dashboard" && "📊 "}
                            {item === "Orders" && "📦 "}
                            {item}
                        </button>
                    ))}

                    {/* Cart */}
                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full text-left px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
                    >
                        🛒 Cart
                    </button>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <Logout />
                </div>
            </aside>

            {/* =========================
                MAIN
            ========================= */}
            <main className="flex-1 min-h-screen bg-slate-950">

                {/* Header */}
                <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                    <div>
                        <h2 className="text-xl font-semibold">
                            {activeMenu}
                        </h2>

                        <p className="text-sm text-slate-500">
                            GreenCraft Marketplace
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">
                                Buyer
                            </p>

                            <p className="text-xs text-slate-500">
                                Customer
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                            B
                        </div>
                    </div>
                </header>

                {/* =========================
                    DASHBOARD
                ========================= */}
                {activeMenu === "Dashboard" && (
                    <div className="p-6">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">
                                Welcome to GreenCraft 🌿
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Discover green plants and handmade
                                products from local sellers.
                            </p>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                {message}
                            </div>
                        )}

                        {/* Loading */}
                        {loading ? (
                            <div className="text-center py-16 text-slate-400">
                                Loading products...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                                <div className="text-5xl">
                                    🌿
                                </div>

                                <h3 className="text-xl font-semibold mt-5">
                                    No products available
                                </h3>

                                <p className="text-slate-500 mt-2">
                                    Sellers have not added any products yet.
                                </p>
                            </div>
                        ) : (
                            <div>

                                {/* Heading */}
                                <div className="flex items-center justify-between mb-5">

                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Explore Products
                                        </h2>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Find something you love.
                                        </p>
                                    </div>

                                    <span className="text-sm text-slate-400">
                                        {products.length} products
                                    </span>
                                </div>

                                {/* Products */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition"
                                        >

                                            {/* Image */}
                                            {product.imageUrl ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-52 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-52 bg-slate-800 flex items-center justify-center">
                                                    <span className="text-5xl">
                                                        🌿
                                                    </span>
                                                </div>
                                            )}

                                            {/* Product info */}
                                            <div className="p-5">

                                                <div className="flex items-start justify-between gap-2">

                                                    <h3 className="text-lg font-semibold">
                                                        {product.name}
                                                    </h3>

                                                    <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
                                                        {product.category}
                                                    </span>
                                                </div>

                                                <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                                                    {product.description}
                                                </p>

                                                <p className="text-xs text-slate-500 mt-4">
                                                    Sold by{" "}
                                                    <span className="text-slate-300">
                                                        {product.sellerName || "Seller"}
                                                    </span>
                                                </p>

                                                {/* Price */}
                                                <div className="flex items-center justify-between mt-4">

                                                    <span className="text-xl font-bold text-emerald-400">
                                                        Rs. {product.price}
                                                    </span>

                                                    <span
                                                        className={
                                                            product.stock > 0
                                                                ? "text-xs text-emerald-400"
                                                                : "text-xs text-red-400"
                                                        }
                                                    >
                                                        {product.stock > 0
                                                            ? `${product.stock} available`
                                                            : "Out of stock"}
                                                    </span>
                                                </div>

                                                {/* Add cart */}
                                                <button
                                                    onClick={() =>
                                                        addToCart(product)
                                                    }
                                                    disabled={product.stock <= 0}
                                                    className="w-full mt-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed font-semibold transition"
                                                >
                                                    {product.stock > 0
                                                        ? "Add to Cart"
                                                        : "Out of Stock"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* =========================
                    ORDERS
                ========================= */}
                {activeMenu === "Orders" && (
                    <div className="p-6">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">
                                My Orders 📦
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Track your orders and check their current status.
                            </p>
                        </div>

                        {/* Total Orders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <p className="text-sm text-slate-500">
                                    Total Orders
                                </p>

                                <h2 className="text-3xl font-bold mt-3">
                                    {orders.length}
                                </h2>

                                <p className="text-sm text-emerald-400 mt-2">
                                    All your orders
                                </p>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <p className="text-sm text-slate-500">
                                    Pending
                                </p>

                                <h2 className="text-3xl font-bold mt-3">
                                    {
                                        orders.filter(
                                            (order) =>
                                                order.status === "Pending"
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <p className="text-sm text-slate-500">
                                    Shipped
                                </p>

                                <h2 className="text-3xl font-bold mt-3">
                                    {
                                        orders.filter(
                                            (order) =>
                                                order.status === "Shipped"
                                        ).length
                                    }
                                </h2>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                <p className="text-sm text-slate-500">
                                    Delivered
                                </p>

                                <h2 className="text-3xl font-bold mt-3">
                                    {
                                        orders.filter(
                                            (order) =>
                                                order.status === "Delivered"
                                        ).length
                                    }
                                </h2>
                            </div>
                        </div>

                        {/* Loading */}
                        {ordersLoading && (
                            <div className="text-center py-16 text-slate-400">
                                Loading your orders...
                            </div>
                        )}

                        {/* Error */}
                        {ordersError && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                {ordersError}
                            </div>
                        )}

                        {/* No orders */}
                        {!ordersLoading &&
                            !ordersError &&
                            orders.length === 0 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                                    <div className="text-5xl">
                                        📦
                                    </div>

                                    <h3 className="text-xl font-semibold mt-5">
                                        No orders yet
                                    </h3>

                                    <p className="text-slate-500 mt-2">
                                        Your orders will appear here after checkout.
                                    </p>

                                    <button
                                        onClick={() =>
                                            setActiveMenu("Dashboard")
                                        }
                                        className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                                    >
                                        Browse Products
                                    </button>
                                </div>
                            )}

                        {/* Orders */}
                        {!ordersLoading &&
                            !ordersError &&
                            orders.length > 0 && (
                                <div className="space-y-6">

                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                                        >

                                            {/* Order Header */}
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Order ID
                                                    </p>

                                                    <p className="font-medium mt-1 break-all">
                                                        {order.id}
                                                    </p>

                                                    {order.createdAt && (
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            Ordered on{" "}
                                                            {new Date(
                                                                order.createdAt
                                                            ).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold">
                                                    {order.status || "Pending"}
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div className="py-6 space-y-4">

                                                {order.items?.map(
                                                    (item, index) => (
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
                                                                    Rs. {item.price} ×{" "}
                                                                    {item.quantity}
                                                                </p>
                                                            </div>

                                                            <div className="font-semibold text-emerald-400">
                                                                Rs.{" "}
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Tracking */}
                                            <div className="border-t border-slate-800 pt-6">

                                                <h3 className="font-semibold text-lg">
                                                    Order Tracking
                                                </h3>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    Follow the progress of your order.
                                                </p>

                                                <OrderTracking
                                                    status={
                                                        order.status || "Pending"
                                                    }
                                                />
                                            </div>

                                            {/* Bottom */}
                                            <div className="border-t border-slate-800 mt-6 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Shipping Address
                                                    </p>

                                                    <p className="text-sm mt-1">
                                                        {order.address ||
                                                            "Not provided"}
                                                    </p>

                                                    {order.phone && (
                                                        <p className="text-sm text-slate-400 mt-1">
                                                            Phone: {order.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="text-left md:text-right">

                                                    <p className="text-xs text-slate-500">
                                                        Total Amount
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
                    </div>
                )}
            </main>
        </div>
    );
}

export default Buyer;

