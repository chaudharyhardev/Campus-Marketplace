import { useNavigate } from "react-router-dom";

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl">
                    ✓
                </div>

                <h1 className="text-3xl font-bold mt-6">
                    Order Placed Successfully!
                </h1>

                <p className="text-slate-400 mt-3">
                    Thank you for your order. Your order has been received successfully.
                </p>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={() => navigate("/buyer")}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold"
                    >
                        My Orders
                    </button>
                </div>

            </div>
        </div>
    );
}

export default OrderSuccess;