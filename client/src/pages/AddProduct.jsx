
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function AddProduct() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Green Plants",
        stock: "",
        imageUrl: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/products", {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                stock: Number(form.stock),
                imageUrl: form.imageUrl
            });

            console.log("Product created:", response.data);

            setMessage("Product added successfully!");

            setTimeout(() => {
                navigate("/seller");
            }, 1000);

        } catch (error) {
            console.error("ADD PRODUCT ERROR:", error);
            console.error("SERVER RESPONSE:", error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">

            <div className="max-w-3xl mx-auto">

                <div className="mb-8">

                    <button
                        onClick={() => navigate("/seller")}
                        className="text-slate-400 hover:text-white mb-5 transition"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold">
                        Add Product
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Add a green plant or handmade product to your store.
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5"
                >

                    <div>
                        <label className="text-sm text-slate-300">
                            Product Name
                        </label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Money Plant"
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="Describe your product..."
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-slate-300">
                                Price (Rs.)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="500"
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-300">
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="10"
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="text-sm text-slate-300">
                            Category
                        </label>

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                        >
                            <option value="Green Plants">Green Plants</option>
                            <option value="Indoor Plants">Indoor Plants</option>
                            <option value="Outdoor Plants">Outdoor Plants</option>
                            <option value="Succulents">Succulents</option>
                            <option value="Handmade">Handmade</option>
                            <option value="Handmade Decor">Handmade Decor</option>
                            <option value="Handmade Gifts">Handmade Gifts</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">
                            Product Image URL
                        </label>

                        <input
                            type="url"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-emerald-500"
                        />
                    </div>

                    {message && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-3">

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/seller")}
                            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;

