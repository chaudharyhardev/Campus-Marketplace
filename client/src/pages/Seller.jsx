import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Logout from "../components/Logout";

function Seller() {
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const [productsLoading, setProductsLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [productsError, setProductsError] = useState("");
    const [ordersError, setOrdersError] = useState("");

    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {
        setProductsLoading(true);
        setProductsError("");

        try {
            // Seller GET /products already returns seller's own products
            const response = await api.get("/products");

            setProducts(response.data);
        } catch (error) {
            console.error("PRODUCT ERROR:", error);

            setProductsError(
                error.response?.data?.message ||
                    "Failed to load products."
            );
        } finally {
            setProductsLoading(false);
        }
    };

    // =====================================================
    // LOAD SELLER ORDERS
    // =====================================================

    const loadOrders = async () => {
        setOrdersLoading(true);
        setOrdersError("");

        try {
            const response = await api.get("/orders/seller");

            console.log("SELLER ORDERS:", response.data);

            setOrders(response.data);
        } catch (error) {
            console.error("ORDER ERROR:", error);

            setOrdersError(
                error.response?.data?.message ||
                    "Failed to load orders."
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadProducts();
        loadOrders();
    }, []);

    // =====================================================
    // LOAD ORDERS WHEN OPENING ORDERS
    // =====================================================

    useEffect(() => {
        if (activeMenu === "Orders") {
            loadOrders();
        }
    }, [activeMenu]);

    // =====================================================
    // ORDER TRACKING
    // =====================================================

    const trackingSteps = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
    ];

    const getCurrentStep = (status) => {
        if (status === "Cancelled") {
            return -1;
        }

        const index = trackingSteps.indexOf(status);

        return index === -1 ? 0 : index;
    };

    const OrderTracking = ({ status }) => {
        const currentStep = getCurrentStep(status);

        if (status === "Cancelled") {
            return (
                <div className="mt-6 p-5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-lg">
                            ✕
                        </div>

                        <div>
                            <p className="font-semibold text-red-400">
                                Order Cancelled
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                                This order has been cancelled.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-6">
                <div className="flex items-center justify-between mb-5">
                    <p className="text-sm font-semibold text-slate-300">
                        Order Tracking
                    </p>

                    <span className="text-xs text-emerald-400">
                        {status}
                    </span>
                </div>

                <div className="relative">
                    {/* Background Line */}
                    <div className="absolute top-5 left-5 right-5 h-1 bg-slate-800 rounded-full" />

                    {/* Progress Line */}
                    <div
                        className="absolute top-5 left-5 h-1 bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                            width:
                                currentStep === 0
                                    ? "0%"
                                    : `${(currentStep / 3) * 100}%`,
                        }}
                    />

                    <div className="relative flex justify-between">
                        {trackingSteps.map((step, index) => {
                            const completed = index <= currentStep;
                            const active = index === currentStep;

                            return (
                                <div
                                    key={step}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-900 z-10 ${
                                            completed
                                                ? "bg-emerald-500 text-white"
                                                : "bg-slate-800 text-slate-500"
                                        }`}
                                    >
                                        {completed
                                            ? "✓"
                                            : index + 1}
                                    </div>

                                    <p
                                        className={`text-xs mt-3 ${
                                            active
                                                ? "text-emerald-400 font-semibold"
                                                : completed
                                                ? "text-slate-300"
                                                : "text-slate-500"
                                        }`}
                                    >
                                        {step}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // =====================================================
    // SELLER REVENUE
    // =====================================================

    const totalRevenue = orders.reduce(
        (total, order) => {
            const sellerTotal = (order.items || []).reduce(
                (sum, item) =>
                    sum +
                    Number(item.price || 0) *
                        Number(item.quantity || 0),
                0
            );

            return total + sellerTotal;
        },
        0
    );

    // =====================================================
    // PRINT BILL
    // =====================================================

    const printBill = (order) => {
        const items = order.items || [];

        const itemsTotal = items.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                    Number(item.quantity || 0),
            0
        );

        const orderDate = order.createdAt
            ? new Date(order.createdAt).toLocaleString()
            : new Date().toLocaleString();

        const billItems = items
            .map((item, index) => {
                const price = Number(item.price || 0);
                const quantity = Number(item.quantity || 0);
                const total = price * quantity;

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(item.name || "Product")}</td>
                        <td>${quantity}</td>
                        <td>Rs. ${price.toFixed(2)}</td>
                        <td>Rs. ${total.toFixed(2)}</td>
                    </tr>
                `;
            })
            .join("");

        const billWindow = window.open(
            "",
            "_blank",
            "width=900,height=700"
        );

        if (!billWindow) {
            alert(
                "Unable to open the print window. Please allow pop-ups for this website."
            );
            return;
        }

        billWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>GreenCraft Invoice - ${order.id || ""}</title>

                <style>
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        padding: 30px;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #222;
                        background: white;
                    }

                    .invoice {
                        max-width: 800px;
                        margin: auto;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        padding-bottom: 25px;
                        border-bottom: 2px solid #16a34a;
                    }

                    .logo {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .logo-box {
                        width: 45px;
                        height: 45px;
                        border-radius: 10px;
                        background: #16a34a;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        font-weight: bold;
                    }

                    .brand-name {
                        font-size: 22px;
                        font-weight: bold;
                    }

                    .brand-subtitle {
                        color: #666;
                        font-size: 12px;
                        margin-top: 3px;
                    }

                    .invoice-title {
                        text-align: right;
                    }

                    .invoice-title h1 {
                        margin: 0;
                        font-size: 28px;
                    }

                    .invoice-title p {
                        margin: 6px 0 0;
                        color: #666;
                        font-size: 13px;
                    }

                    .info-section {
                        display: flex;
                        justify-content: space-between;
                        gap: 40px;
                        margin: 30px 0;
                    }

                    .info-box {
                        flex: 1;
                    }

                    .info-title {
                        font-size: 12px;
                        color: #777;
                        text-transform: uppercase;
                        margin-bottom: 8px;
                        font-weight: bold;
                    }

                    .info-value {
                        font-size: 14px;
                        line-height: 1.6;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th {
                        background: #f3f4f6;
                        padding: 12px;
                        text-align: left;
                        font-size: 13px;
                        border-bottom: 1px solid #ddd;
                    }

                    td {
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                        font-size: 13px;
                    }

                    .text-right {
                        text-align: right;
                    }

                    .summary {
                        margin-top: 25px;
                        margin-left: auto;
                        width: 300px;
                    }

                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        font-size: 14px;
                    }

                    .grand-total {
                        border-top: 2px solid #222;
                        margin-top: 8px;
                        padding-top: 12px;
                        font-size: 18px;
                        font-weight: bold;
                    }

                    .status {
                        margin-top: 25px;
                        padding: 12px 15px;
                        background: #f0fdf4;
                        border: 1px solid #bbf7d0;
                        border-radius: 8px;
                        color: #15803d;
                        font-size: 13px;
                    }

                    .footer {
                        margin-top: 50px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        text-align: center;
                        color: #777;
                        font-size: 12px;
                    }

                    .print-button {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: #16a34a;
                        color: white;
                        border: none;
                        padding: 12px 20px;
                        border-radius: 8px;
                        font-weight: bold;
                        cursor: pointer;
                    }

                    @media print {
                        body {
                            padding: 0;
                        }

                        .print-button {
                            display: none;
                        }

                        .invoice {
                            max-width: none;
                        }
                    }
                </style>
            </head>

            <body>

                <button
                    class="print-button"
                    onclick="window.print()"
                >
                    🖨️ Print Bill
                </button>

                <div class="invoice">

                    <div class="header">

                        <div class="logo">
                            <div class="logo-box">
                                G
                            </div>

                            <div>
                                <div class="brand-name">
                                    GreenCraft
                                </div>

                                <div class="brand-subtitle">
                                    Marketplace
                                </div>
                            </div>
                        </div>

                        <div class="invoice-title">
                            <h1>INVOICE</h1>
                            <p>
                                Order #${escapeHtml(
                                    order.id || "N/A"
                                )}
                            </p>
                            <p>
                                ${escapeHtml(orderDate)}
                            </p>
                        </div>

                    </div>

                    <div class="info-section">

                        <div class="info-box">
                            <div class="info-title">
                                Customer
                            </div>

                            <div class="info-value">
                                <strong>
                                    ${escapeHtml(
                                        order.buyerName ||
                                            order.fullName ||
                                            "Buyer"
                                    )}
                                </strong>
                                <br />

                                ${
                                    order.phone
                                        ? `Phone: ${escapeHtml(
                                              order.phone
                                          )}<br />`
                                        : ""
                                }

                                ${
                                    order.address
                                        ? `Address: ${escapeHtml(
                                              order.address
                                          )}<br />`
                                        : ""
                                }

                                ${
                                    order.city
                                        ? `City: ${escapeHtml(
                                              order.city
                                          )}`
                                        : ""
                                }
                            </div>
                        </div>

                        <div class="info-box">
                            <div class="info-title">
                                Seller
                            </div>

                            <div class="info-value">
                                <strong>
                                    GreenCraft Seller
                                </strong>
                                <br />
                                Marketplace Seller
                            </div>
                        </div>

                    </div>

                    <table>

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${billItems}
                        </tbody>

                    </table>

                    <div class="summary">

                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>
                                Rs. ${itemsTotal.toFixed(2)}
                            </span>
                        </div>

                        <div class="summary-row">
                            <span>Shipping</span>
                            <span>
                                Rs. 0.00
                            </span>
                        </div>

                        <div class="summary-row grand-total">
                            <span>Grand Total</span>
                            <span>
                                Rs. ${itemsTotal.toFixed(2)}
                            </span>
                        </div>

                    </div>

                    <div class="status">
                        <strong>Order Status:</strong>
                        ${escapeHtml(
                            order.status || "Pending"
                        )}
                    </div>

                    <div class="footer">
                        <p>
                            Thank you for shopping with GreenCraft Marketplace.
                        </p>

                        <p>
                            This is a computer-generated invoice.
                        </p>
                    </div>

                </div>

            </body>
            </html>
        `);

        billWindow.document.close();

        // Give the browser a moment to render the invoice
        setTimeout(() => {
            billWindow.focus();
        }, 300);
    };

    // =====================================================
    // ESCAPE HTML
    // Prevent customer/product data from becoming HTML
    // =====================================================

    const escapeHtml = (value) => {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">

                {/* LOGO */}

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

                {/* NAVIGATION */}

                <nav className="flex-1 p-4 space-y-2">

                    <button
                        onClick={() =>
                            setActiveMenu("Dashboard")
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                            activeMenu === "Dashboard"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        📊 Dashboard
                    </button>

                    <button
                        onClick={() =>
                            setActiveMenu("Products")
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                            activeMenu === "Products"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        📦 Products
                    </button>

                    <button
                        onClick={() =>
                            navigate("/seller/add-product")
                        }
                        className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                    >
                        ➕ Add Product
                    </button>

                    <button
                        onClick={() =>
                            setActiveMenu("Orders")
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                            activeMenu === "Orders"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        🛒 Orders
                    </button>

                    <button
                        onClick={() =>
                            setActiveMenu("Reports")
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                            activeMenu === "Reports"
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        📈 Reports
                    </button>

                </nav>

                {/* LOGOUT */}

                <div className="p-4 border-t border-slate-800">
                    <Logout />
                </div>

            </aside>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="flex-1 min-h-screen">

                {/* HEADER */}

                <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                    <div>
                        <h2 className="text-xl font-semibold">
                            {activeMenu}
                        </h2>

                        <p className="text-sm text-slate-500">
                            Manage GreenCraft Marketplace
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">
                                Seller
                            </p>

                            <p className="text-xs text-slate-500">
                                Store Owner
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
                            S
                        </div>

                    </div>

                </header>

                {/* =================================================
                    DASHBOARD
                ================================================= */}

                {activeMenu === "Dashboard" && (
                    <div className="p-6">

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold">
                                Welcome back, Seller 👋
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Here's what's happening with your store.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            <StatCard
                                title="My Products"
                                value={products.length}
                                description="Products listed"
                            />

                            <StatCard
                                title="Orders"
                                value={orders.length}
                                description="Orders containing your products"
                            />

                            <StatCard
                                title="Revenue"
                                value={`Rs. ${totalRevenue.toFixed(2)}`}
                                description="Total product sales"
                            />

                        </div>

                        {/* QUICK ADD PRODUCT */}

                        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Add a new product
                                    </h3>

                                    <p className="text-slate-500 mt-1">
                                        List a new product in the marketplace.
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        navigate("/seller/add-product")
                                    }
                                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition"
                                >
                                    ➕ Add Product
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                {activeMenu === "Products" && (
                    <div className="p-6">

                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>
                                <h1 className="text-3xl font-bold">
                                    My Products
                                </h1>

                                <p className="text-slate-400 mt-2">
                                    Products listed by you.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate("/seller/add-product")
                                }
                                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition"
                            >
                                ➕ Add Product
                            </button>

                        </div>

                        {productsError && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                {productsError}
                            </div>
                        )}

                        {productsLoading ? (
                            <div className="text-center py-16 text-slate-400">
                                Loading products...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                                <div className="text-5xl">
                                    🌿
                                </div>

                                <h3 className="text-xl font-semibold mt-5">
                                    No products yet
                                </h3>

                                <p className="text-slate-500 mt-2">
                                    You have not added any products.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/seller/add-product")
                                    }
                                    className="mt-6 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition"
                                >
                                    ➕ Add Your First Product
                                </button>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition"
                                    >

                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-52 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-52 bg-slate-800 flex items-center justify-center text-5xl">
                                                🌿
                                            </div>
                                        )}

                                        <div className="p-5">

                                            <div className="flex items-start justify-between gap-2">

                                                <h3 className="text-lg font-semibold">
                                                    {product.name}
                                                </h3>

                                                <span className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                                                    {product.category}
                                                </span>

                                            </div>

                                            <p className="text-slate-400 text-sm mt-3">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-5">

                                                <span className="text-xl font-bold text-emerald-400">
                                                    Rs. {product.price}
                                                </span>

                                                <span className="text-sm text-slate-400">
                                                    Stock: {product.stock}
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>
                        )}

                    </div>
                )}

                {/* =================================================
                    ORDERS
                ================================================= */}

                {activeMenu === "Orders" && (
                    <div className="p-6">

                        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>
                                <h1 className="text-3xl font-bold">
                                    My Orders
                                </h1>

                                <p className="text-slate-400 mt-2">
                                    Track customer orders containing your products.
                                </p>
                            </div>

                            <button
                                onClick={loadOrders}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                            >
                                🔄 Refresh
                            </button>

                        </div>

                        {ordersError && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                {ordersError}
                            </div>
                        )}

                        {ordersLoading && (
                            <div className="text-center py-16 text-slate-400">
                                Loading orders...
                            </div>
                        )}

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
                                        Customer orders containing your products will appear here.
                                    </p>

                                </div>
                            )}

                        {!ordersLoading &&
                            orders.length > 0 && (
                                <div className="space-y-6">

                                    {orders.map((order) => {

                                        const orderTotal =
                                            (order.items || []).reduce(
                                                (total, item) =>
                                                    total +
                                                    Number(
                                                        item.price || 0
                                                    ) *
                                                        Number(
                                                            item.quantity ||
                                                                0
                                                        ),
                                                0
                                            );

                                        return (
                                            <div
                                                key={order.id}
                                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                                            >

                                                {/* ORDER HEADER */}

                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-slate-800">

                                                    <div>

                                                        <p className="text-xs text-slate-500">
                                                            Order ID
                                                        </p>

                                                        <p className="font-medium mt-1 break-all">
                                                            {order.id}
                                                        </p>

                                                        <p className="text-sm text-slate-400 mt-2">
                                                            Buyer:{" "}
                                                            <span className="text-white">
                                                                {order.buyerName ||
                                                                    order.fullName ||
                                                                    "Buyer"}
                                                            </span>
                                                        </p>

                                                        {order.createdAt && (
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {new Date(
                                                                    order.createdAt
                                                                ).toLocaleString()}
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3">

                                                        <div
                                                            className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                                                order.status ===
                                                                "Delivered"
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : order.status ===
                                                                      "Cancelled"
                                                                    ? "bg-red-500/10 text-red-400"
                                                                    : "bg-amber-500/10 text-amber-400"
                                                            }`}
                                                        >
                                                            {order.status ||
                                                                "Pending"}
                                                        </div>

                                                        {/* PRINT BILL */}

                                                        <button
                                                            onClick={() =>
                                                                printBill(
                                                                    order
                                                                )
                                                            }
                                                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition"
                                                        >
                                                            🖨️ Print Bill
                                                        </button>

                                                    </div>

                                                </div>

                                                {/* TRACKING */}

                                                <OrderTracking
                                                    status={
                                                        order.status ||
                                                        "Pending"
                                                    }
                                                />

                                                {/* PRODUCTS */}

                                                <div className="mt-8">

                                                    <p className="text-sm font-semibold text-slate-300 mb-4">
                                                        Your Products
                                                    </p>

                                                    <div className="space-y-4">

                                                        {order.items?.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={`${item.productId}-${index}`}
                                                                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800"
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

                                                                        <h3 className="font-medium">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </h3>

                                                                        <p className="text-sm text-slate-500 mt-1">
                                                                            Rs.{" "}
                                                                            {
                                                                                item.price
                                                                            }{" "}
                                                                            ×{" "}
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                    <div className="font-semibold text-emerald-400">

                                                                        Rs.{" "}
                                                                        {(
                                                                            Number(
                                                                                item.price ||
                                                                                    0
                                                                            ) *
                                                                            Number(
                                                                                item.quantity ||
                                                                                    0
                                                                            )
                                                                        ).toFixed(
                                                                            2
                                                                        )}

                                                                    </div>

                                                                </div>
                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                                {/* ORDER FOOTER */}

                                                <div className="border-t border-slate-800 mt-6 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                                    <div>

                                                        <p className="text-xs text-slate-500">
                                                            Shipping Address
                                                        </p>

                                                        <p className="text-sm mt-1">
                                                            {order.address ||
                                                                "Not provided"}
                                                        </p>

                                                        {order.city && (
                                                            <p className="text-sm text-slate-400 mt-1">
                                                                City:{" "}
                                                                {order.city}
                                                            </p>
                                                        )}

                                                        {order.phone && (
                                                            <p className="text-sm text-slate-400 mt-1">
                                                                Phone:{" "}
                                                                {order.phone}
                                                            </p>
                                                        )}

                                                    </div>

                                                    <div className="text-left md:text-right">

                                                        <p className="text-xs text-slate-500">
                                                            Your Products Total
                                                        </p>

                                                        <p className="text-2xl font-bold text-emerald-400">
                                                            Rs.{" "}
                                                            {orderTotal.toFixed(
                                                                2
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                    </div>
                )}

                {/* =================================================
                    REPORTS
                ================================================= */}

                {activeMenu === "Reports" && (
                    <div className="p-6">

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold">
                                Reports
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Overview of your store performance.
                            </p>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            <StatCard
                                title="Total Products"
                                value={products.length}
                                description="Listed products"
                            />

                            <StatCard
                                title="Total Orders"
                                value={orders.length}
                                description="Customer orders"
                            />

                            <StatCard
                                title="Total Revenue"
                                value={`Rs. ${totalRevenue.toFixed(2)}`}
                                description="Sales from your products"
                            />

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    title,
    value,
    description,
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition">

            <p className="text-sm text-slate-500">
                {title}
            </p>

            <h3 className="text-3xl font-bold mt-3">
                {value}
            </h3>

            <p className="text-sm text-emerald-400 mt-2">
                {description}
            </p>

        </div>
    );
}

export default Seller;