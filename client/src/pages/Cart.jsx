
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    // Load cart
    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);
    }, []);

    // Save cart
    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    // Increase quantity
    const increaseQuantity = (id) => {
        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: Math.min(
                        item.quantity + 1,
                        item.stock
                    ),
                };
            }

            return item;
        });

        updateCart(updatedCart);
    };

    // Decrease quantity
    const decreaseQuantity = (id) => {
        const updatedCart = cart
            .map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    };
                }

                return item;
            })
            .filter((item) => item.quantity > 0);

        updateCart(updatedCart);
    };

    // Remove product
    const removeProduct = (id) => {
        const updatedCart = cart.filter(
            (item) => item.id !== id
        );

        updateCart(updatedCart);
    };

    // Total price
    const total = cart.reduce(
        (sum, item) =>
            sum + Number(item.price) * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        GreenCraft
                    </h1>

                    <p className="text-sm text-slate-500">
                        Shopping Cart
                    </p>
                </div>

                <button
                    onClick={() => navigate("/buyer")}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                >
                    ← Continue Shopping
                </button>

            </header>

            {/* Main */}
            <main className="p-6 max-w-6xl mx-auto">

                <h2 className="text-3xl font-bold mb-8">
                    Your Cart 🛒
                </h2>

                {cart.length === 0 ? (

                    /* Empty Cart */
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

                        <div className="text-6xl mb-5">
                            🛒
                        </div>

                        <h3 className="text-xl font-semibold">
                            Your cart is empty
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Add some products to your cart.
                        </p>

                        <button
                            onClick={() => navigate("/buyer")}
                            className="mt-6 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                        >
                            Browse Products
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">

                            {cart.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-5"
                                >

                                    {/* Image */}
                                    {item.imageUrl ? (

                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-28 h-28 rounded-xl object-cover"
                                        />

                                    ) : (

                                        <div className="w-28 h-28 rounded-xl bg-slate-800 flex items-center justify-center text-4xl">
                                            🌿
                                        </div>

                                    )}

                                    {/* Details */}
                                    <div className="flex-1">

                                        <div className="flex justify-between gap-3">

                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {item.name}
                                                </h3>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {item.category}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeProduct(item.id)
                                                }
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Remove
                                            </button>

                                        </div>

                                        <p className="text-emerald-400 font-semibold mt-3">
                                            Rs. {item.price}
                                        </p>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-3 mt-4">

                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700"
                                            >
                                                −
                                            </button>

                                            <span className="w-8 text-center font-semibold">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.stock
                                                }
                                                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
                                            >
                                                +
                                            </button>

                                        </div>

                                        <p className="text-sm text-slate-400 mt-3">
                                            Subtotal: Rs.{" "}
                                            {Number(item.price) *
                                                item.quantity}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {/* Order Summary */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">

                            <h3 className="text-xl font-semibold">
                                Order Summary
                            </h3>

                            <div className="flex justify-between mt-6 text-slate-400">
                                <span>
                                    Items
                                </span>

                                <span>
                                    {cart.reduce(
                                        (sum, item) =>
                                            sum + item.quantity,
                                        0
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between mt-4 text-slate-400">
                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    Rs. {total}
                                </span>
                            </div>

                            <div className="border-t border-slate-800 my-5"></div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>
                                    Total
                                </span>

                                <span className="text-emerald-400">
                                    Rs. {total}
                                </span>
                            </div>

                            <button
                                onClick={() =>
                                    navigate("/checkout")
                                }
                                className="w-full mt-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition"
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                )}

            </main>
        </div>
    );
}

export default Cart;

