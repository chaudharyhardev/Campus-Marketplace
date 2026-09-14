import { useEffect, useState } from "react";
import api from "../api/api";
import Logout from "../components/Logout";

function Admin() {
const [activeMenu, setActiveMenu] = useState("Dashboard");

// =========================
// USERS
// =========================
const [users, setUsers] = useState([]);
const [usersLoading, setUsersLoading] = useState(false);
const [usersError, setUsersError] = useState("");

// =========================
// PRODUCTS
// =========================
const [products, setProducts] = useState([]);
const [productsLoading, setProductsLoading] = useState(false);
const [productsError, setProductsError] = useState("");

// =========================
// ORDERS
// =========================
const [orders, setOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [ordersError, setOrdersError] = useState("");

// =========================
// MENU
// =========================

const menuItems = [
    "Dashboard",
    "Users",
    "Products",
    "Orders",
    "Reports",
];

// =====================================================
// LOAD USERS
// =====================================================

const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError("");

    try {
        const response = await api.get("/users");

        console.log("USERS:", response.data);

        setUsers(response.data);
    } catch (error) {
        console.error("LOAD USERS ERROR:", error);

        setUsersError(
            error.response?.data?.message ||
                "Failed to load users."
        );
    } finally {
        setUsersLoading(false);
    }
};

// =====================================================
// LOAD PRODUCTS
// =====================================================

const loadProducts = async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
        const response = await api.get("/products");

        console.log("PRODUCTS:", response.data);

        setProducts(response.data);
    } catch (error) {
        console.error("LOAD PRODUCTS ERROR:", error);

        setProductsError(
            error.response?.data?.message ||
                "Failed to load products."
        );
    } finally {
        setProductsLoading(false);
    }
};

// =====================================================
// LOAD ORDERS
// =====================================================

const loadOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");

    try {
        const response = await api.get("/orders/admin");

        console.log("ORDERS:", response.data);

        setOrders(response.data);
    } catch (error) {
        console.error("LOAD ORDERS ERROR:", error);

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
    loadUsers();
    loadProducts();
    loadOrders();
}, []);

// =====================================================
// LOAD DATA WHEN MENU CHANGES
// =====================================================

useEffect(() => {
    if (activeMenu === "Users") {
        loadUsers();
    }

    if (activeMenu === "Products") {
        loadProducts();
    }

    if (activeMenu === "Orders") {
        loadOrders();
    }
}, [activeMenu]);

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await api.delete(`/users/${id}`);

        setUsers((currentUsers) =>
            currentUsers.filter((user) => user.id !== id)
        );

        alert("User deleted successfully.");
    } catch (error) {
        console.error("DELETE USER ERROR:", error);

        alert(
            error.response?.data?.message ||
                "Failed to delete user."
        );
    }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await api.delete(`/products/${id}`);

        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) => product.id !== id
            )
        );

        alert("Product deleted successfully.");
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error);

        alert(
            error.response?.data?.message ||
                "Failed to delete product."
        );
    }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateStatus = async (id, status) => {
    try {
        await api.put(`/orders/${id}/status`, {
            status: status,
        });

        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === id
                    ? {
                          ...order,
                          status: status,
                      }
                    : order
            )
        );
    } catch (error) {
        console.error("UPDATE STATUS ERROR:", error);

        alert(
            error.response?.data?.message ||
                "Failed to update order status."
        );
    }
};

// =====================================================
// STATISTICS
// =====================================================

const totalRevenue = orders.reduce(
    (total, order) =>
        total + Number(order.totalAmount || 0),
    0
);

const totalSellers = users.filter(
    (user) => user.role === "Seller"
).length;

const totalBuyers = users.filter(
    (user) => user.role === "Buyer"
).length;

// =====================================================
// MAIN UI
// =====================================================

return (
    <div className="min-h-screen bg-slate-950 text-white flex">

        {/* ================= SIDEBAR ================= */}

        <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">

            {/* LOGO */}

            <div className="h-20 flex items-center px-6 border-b border-slate-800">

                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl">
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

                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() =>
                            setActiveMenu(item)
                        }
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                            activeMenu === item
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                        {item}
                    </button>
                ))}

            </nav>

            {/* LOGOUT */}

            <div className="p-4 border-t border-slate-800">
                <Logout />
            </div>

        </aside>

        {/* ================= MAIN ================= */}

        <main className="flex-1 min-h-screen bg-slate-950">

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
                            System Admin
                        </p>

                        <p className="text-xs text-slate-500">
                            Administrator
                        </p>

                    </div>

                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                        A
                    </div>

                </div>

            </header>

            {/* =====================================================
                DASHBOARD
            ===================================================== */}

            {activeMenu === "Dashboard" && (

                <div className="p-6">

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">
                            Welcome back, Admin 👋
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Here's what's happening in your marketplace.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <StatCard
                            title="Total Users"
                            value={users.length}
                            description={`${totalBuyers} Buyers`}
                        />

                        <StatCard
                            title="Products"
                            value={products.length}
                            description={`${totalSellers} Sellers`}
                        />

                        <StatCard
                            title="Orders"
                            value={orders.length}
                            description="Marketplace orders"
                        />

                        <StatCard
                            title="Revenue"
                            value={`Rs. ${totalRevenue.toFixed(2)}`}
                            description="Total order revenue"
                        />

                    </div>

                </div>

            )}

            {/* =====================================================
                USERS
            ===================================================== */}

            {activeMenu === "Users" && (

                <div className="p-6">

                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Users
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Manage all registered users.
                            </p>

                        </div>

                        <button
                            onClick={loadUsers}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                        >
                            🔄 Refresh
                        </button>

                    </div>

                    {usersError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            {usersError}
                        </div>
                    )}

                    {usersLoading ? (

                        <div className="text-center py-16 text-slate-400">
                            Loading users...
                        </div>

                    ) : users.length === 0 ? (

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                            <div className="text-5xl">
                                👤
                            </div>

                            <h3 className="text-xl font-semibold mt-5">
                                No users found
                            </h3>

                        </div>

                    ) : (

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-slate-800">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-sm text-slate-400">
                                                Name
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm text-slate-400">
                                                Email
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm text-slate-400">
                                                Role
                                            </th>

                                            <th className="text-left px-6 py-4 text-sm text-slate-400">
                                                Created
                                            </th>

                                            <th className="text-right px-6 py-4 text-sm text-slate-400">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {users.map((user) => (

                                            <tr
                                                key={user.id}
                                                className="border-t border-slate-800 hover:bg-slate-800/50"
                                            >

                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-slate-400">
                                                    {user.email}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                                            user.role ===
                                                            "Admin"
                                                                ? "bg-indigo-500/10 text-indigo-400"
                                                                : user.role ===
                                                                  "Seller"
                                                                ? "bg-emerald-500/10 text-emerald-400"
                                                                : "bg-blue-500/10 text-blue-400"
                                                        }`}
                                                    >
                                                        {user.role}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td className="px-6 py-4 text-right">

                                                    {user.role !==
                                                    "Admin" ? (

                                                        <button
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                            className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                                        >
                                                            Delete
                                                        </button>

                                                    ) : (

                                                        <span className="text-xs text-slate-500">
                                                            Protected
                                                        </span>

                                                    )}

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}

                </div>

            )}

            {/* =====================================================
                PRODUCTS
            ===================================================== */}

            {activeMenu === "Products" && (

                <div className="p-6">

                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <h1 className="text-3xl font-bold">
                                Products
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Manage all products listed on the marketplace.
                            </p>

                        </div>

                        <button
                            onClick={loadProducts}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                        >
                            🔄 Refresh
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
                                📦
                            </div>

                            <h3 className="text-xl font-semibold mt-5">
                                No products found
                            </h3>

                            <p className="text-slate-500 mt-2">
                                Sellers have not added any products yet.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                            {products.map((product) => (

                                <div
                                    key={product.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition"
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

                                        <div className="flex items-start justify-between gap-3">

                                            <h3 className="text-lg font-semibold">
                                                {product.name}
                                            </h3>

                                            <span className="text-xs px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400">
                                                {product.category}
                                            </span>

                                        </div>

                                        <p className="text-slate-400 text-sm mt-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="mt-4">

                                            <p className="text-sm text-slate-500">
                                                Seller
                                            </p>

                                            <p className="text-sm text-slate-300">
                                                {product.sellerName ||
                                                    "Seller"}
                                            </p>

                                        </div>

                                        <div className="flex items-center justify-between mt-5">

                                            <span className="text-xl font-bold text-emerald-400">
                                                Rs.{" "}
                                                {product.price}
                                            </span>

                                            <span className="text-sm text-slate-400">
                                                Stock:{" "}
                                                {product.stock}
                                            </span>

                                        </div>

                                        <button
                                            onClick={() =>
                                                deleteProduct(
                                                    product.id
                                                )
                                            }
                                            className="w-full mt-5 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                        >
                                            Delete Product
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

            {/* =====================================================
                ORDERS
            ===================================================== */}

            {activeMenu === "Orders" && (

                <div className="p-6">

                    <div className="mb-8">

                        <div className="flex items-center justify-between">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    All Orders
                                </h1>

                                <p className="text-slate-400 mt-2">
                                    Manage customer orders and update their status.
                                </p>

                            </div>

                            <button
                                onClick={loadOrders}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
                            >
                                🔄 Refresh
                            </button>

                        </div>

                    </div>

                    {ordersLoading && (

                        <div className="text-center py-16 text-slate-400">
                            Loading orders...
                        </div>

                    )}

                    {ordersError && (

                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            {ordersError}
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
                                    Customer orders will appear here.
                                </p>

                            </div>

                        )}

                    {!ordersLoading &&
                        !ordersError &&
                        orders.length > 0 && (

                            <div className="space-y-5">

                                {orders.map((order) => (

                                    <div
                                        key={order.id}
                                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                                    >

                                        {/* ORDER HEADER */}

                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">

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

                                            {/* STATUS */}

                                            <div>

                                                <select
                                                    value={
                                                        order.status ||
                                                        "Pending"
                                                    }
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                                                >

                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="Confirmed">
                                                        Confirmed
                                                    </option>

                                                    <option value="Shipped">
                                                        Shipped
                                                    </option>

                                                    <option value="Delivered">
                                                        Delivered
                                                    </option>

                                                    <option value="Cancelled">
                                                        Cancelled
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                        {/* ITEMS */}

                                        <div className="py-5 space-y-4">

                                            {order.items?.map(
                                                (item, index) => (

                                                    <div
                                                        key={`${item.productId || "product"}-${index}`}
                                                        className="flex items-center gap-4"
                                                    >

                                                        {item.imageUrl ? (

                                                            <img
                                                                src={
                                                                    item.imageUrl
                                                                }
                                                                alt={
                                                                    item.name ||
                                                                    "Product"
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
                                                                {item.name ||
                                                                    item.productName ||
                                                                    "Product"}
                                                            </h3>

                                                            <p className="text-sm text-slate-500">
                                                                Rs.{" "}
                                                                {item.price}{" "}
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
                                                            ).toFixed(2)}
                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                        {/* BOTTOM */}

                                        <div className="border-t border-slate-800 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

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
                                                        Phone:{" "}
                                                        {order.phone}
                                                    </p>

                                                )}

                                            </div>

                                            <div className="text-left md:text-right">

                                                <p className="text-xs text-slate-500">
                                                    Total Amount
                                                </p>

                                                <p className="text-2xl font-bold text-emerald-400">
                                                    Rs.{" "}
                                                    {Number(
                                                        order.totalAmount ||
                                                            0
                                                    ).toFixed(2)}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                </div>

            )}

            {/* =====================================================
                REPORTS
            ===================================================== */}

            {activeMenu === "Reports" && (

                <div className="p-6">

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold">
                            Reports
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Overview of your marketplace performance.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <StatCard
                            title="Total Users"
                            value={users.length}
                            description="Registered users"
                        />

                        <StatCard
                            title="Buyers"
                            value={totalBuyers}
                            description="Buyer accounts"
                        />

                        <StatCard
                            title="Sellers"
                            value={totalSellers}
                            description="Seller accounts"
                        />

                        <StatCard
                            title="Products"
                            value={products.length}
                            description="Marketplace products"
                        />

                        <StatCard
                            title="Orders"
                            value={orders.length}
                            description="Total orders"
                        />

                        <StatCard
                            title="Revenue"
                            value={`Rs. ${totalRevenue.toFixed(2)}`}
                            description="Total order value"
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
return ( <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition">


        <p className="text-sm text-slate-500">
            {title}
        </p>

        <h3 className="text-3xl font-bold mt-3">
            {value}
        </h3>

        <p className="text-sm text-green-400 mt-2">
            {description}
        </p>

    </div>
);


}

export default Admin;