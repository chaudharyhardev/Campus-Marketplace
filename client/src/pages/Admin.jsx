import { useState } from "react";
import Logout from "../components/Logout";

function Admin() {
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    const menuItems = [
        "Dashboard",
        "Users",
        "Products",
        "Orders",
        "Reports"
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">

                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl">
                        C
                    </div>

                    <div className="ml-3">
                        <h1 className="font-bold text-white">
                            Campus
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
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {item}
                        </button>
                    ))}

                </nav>

                {/* ONLY Logout */}
                <div className="p-4 border-t border-slate-800">
                    <Logout />
                </div>

            </aside>

            {/* Main */}
            <main className="flex-1 min-h-screen bg-slate-950">

                {/* Top Navbar - NO LOGOUT HERE */}
                <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                    <div>
                        <h2 className="text-xl font-semibold">
                            {activeMenu}
                        </h2>

                        <p className="text-sm text-slate-500">
                            Manage Campus Marketplace
                        </p>
                    </div>

                    {/* Admin Profile */}
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

                {/* Content */}
                <div className="p-6 bg-slate-950 min-h-[calc(100vh-5rem)]">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            Welcome back, Admin 👋
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Here's what's happening in your marketplace.
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <StatCard
                            title="Total Users"
                            value="1,248"
                            description="+12% this month"
                        />

                        <StatCard
                            title="Products"
                            value="356"
                            description="+8% this month"
                        />

                        <StatCard
                            title="Orders"
                            value="842"
                            description="+18% this month"
                        />

                        <StatCard
                            title="Revenue"
                            value="Rs. 2.4M"
                            description="+15% this month"
                        />

                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl">

                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-lg font-semibold">
                                Recent Activity
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Latest marketplace activities
                            </p>
                        </div>

                        <div className="p-6 space-y-5">

                            <Activity
                                title="New user registered"
                                description="A new buyer joined Campus Marketplace."
                            />

                            <Activity
                                title="New product added"
                                description="A seller added a new product."
                            />

                            <Activity
                                title="New order received"
                                description="A new marketplace order was placed."
                            />

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

function StatCard({ title, value, description }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition">

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

function Activity({ title, description }) {
    return (
        <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                ●
            </div>

            <div>
                <h3 className="font-medium">
                    {title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                    {description}
                </p>
            </div>

        </div>
    );
}

export default Admin;