import { Link } from "react-router-dom";

function Home() {
return ( <div className="min-h-screen bg-slate-950 text-white">


        {/* ================= HEADER ================= */}

        <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LOGO */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-xl">
                        G
                    </div>

                    <div>
                        <h1 className="font-bold text-lg">
                            GreenCraft
                        </h1>

                        <p className="text-xs text-slate-500">
                            Marketplace
                        </p>
                    </div>
                </Link>

                {/* NAVIGATION */}

                <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                    <a
                        href="#home"
                        className="hover:text-white transition"
                    >
                        Home
                    </a>

                    <a
                        href="#features"
                        className="hover:text-white transition"
                    >
                        Features
                    </a>

                    <a
                        href="#about"
                        className="hover:text-white transition"
                    >
                        About
                    </a>
                </nav>

                {/* AUTH BUTTONS */}

                <div className="flex items-center gap-3">

                    <Link
                        to="/login"
                        className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-sm font-semibold"
                    >
                        Register
                    </Link>

                </div>

            </div>
        </header>

        {/* ================= HERO ================= */}

        <main>

            <section
                id="home"
                className="relative overflow-hidden"
            >

                <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">

                    <div className="max-w-3xl">

                        {/* BADGE */}

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-7">
                            <span>🌿</span>
                            <span>Welcome to GreenCraft Marketplace</span>
                        </div>

                        {/* TITLE */}

                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">

                            Buy and sell{" "}
                            <span className="text-emerald-400">
                                products
                            </span>{" "}
                            with ease.

                        </h2>

                        {/* DESCRIPTION */}

                        <p className="text-lg md:text-xl text-slate-400 mt-6 max-w-2xl leading-relaxed">
                            GreenCraft is a simple marketplace where
                            buyers can discover products and sellers can
                            build their own online store.
                        </p>

                        {/* BUTTONS */}

                        <div className="flex flex-wrap gap-4 mt-9">

                            <Link
                                to="/register"
                                className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-semibold"
                            >
                                Get Started →
                            </Link>

                            <Link
                                to="/login"
                                className="px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition font-semibold"
                            >
                                Login to Marketplace
                            </Link>

                        </div>

                    </div>

                </div>

                {/* DECORATIVE BACKGROUND */}

                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            </section>

            {/* ================= FEATURES ================= */}

            <section
                id="features"
                className="border-t border-slate-800 bg-slate-900/40"
            >

                <div className="max-w-7xl mx-auto px-6 py-20">

                    <div className="text-center max-w-2xl mx-auto mb-12">

                        <p className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">
                            Marketplace
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold mt-3">
                            Everything you need in one place
                        </h2>

                        <p className="text-slate-400 mt-4">
                            A simple platform designed for buyers,
                            sellers and marketplace administrators.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* BUYER */}

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-emerald-500/40 transition">

                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                                🛍️
                            </div>

                            <h3 className="text-xl font-semibold mt-5">
                                For Buyers
                            </h3>

                            <p className="text-slate-400 mt-3 leading-relaxed">
                                Discover products, place orders and
                                track your purchases from your buyer
                                dashboard.
                            </p>

                        </div>

                        {/* SELLER */}

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-emerald-500/40 transition">

                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
                                🏪
                            </div>

                            <h3 className="text-xl font-semibold mt-5">
                                For Sellers
                            </h3>

                            <p className="text-slate-400 mt-3 leading-relaxed">
                                Add products, manage your inventory,
                                view customer orders and track your
                                store performance.
                            </p>

                        </div>

                        {/* ADMIN */}

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-indigo-500/40 transition">

                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl">
                                🛡️
                            </div>

                            <h3 className="text-xl font-semibold mt-5">
                                For Admins
                            </h3>

                            <p className="text-slate-400 mt-3 leading-relaxed">
                                Manage users, products and orders while
                                monitoring the overall marketplace.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= ABOUT ================= */}

            <section
                id="about"
                className="border-t border-slate-800"
            >

                <div className="max-w-5xl mx-auto px-6 py-20 text-center">

                    <div className="text-5xl mb-6">
                        🌿
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold">
                        Simple. Secure. Marketplace.
                    </h2>

                    <p className="text-slate-400 mt-5 max-w-2xl mx-auto leading-relaxed">
                        GreenCraft connects buyers and sellers through
                        one easy-to-use marketplace. Create an account,
                        explore products and start shopping today.
                    </p>

                    <Link
                        to="/register"
                        className="inline-block mt-8 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-semibold"
                    >
                        Create Your Account
                    </Link>

                </div>

            </section>

        </main>

        {/* ================= FOOTER ================= */}

        <footer className="border-t border-slate-800 bg-slate-900">

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold">
                        G
                    </div>

                    <div>
                        <p className="font-semibold">
                            GreenCraft
                        </p>

                        <p className="text-xs text-slate-500">
                            Marketplace
                        </p>
                    </div>

                </div>

                <p className="text-sm text-slate-500">
                    © {new Date().getFullYear()} GreenCraft Marketplace.
                    All rights reserved.
                </p>

            </div>

        </footer>

    </div>
);


}

export default Home;
