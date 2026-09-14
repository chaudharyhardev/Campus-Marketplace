
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);

                const product = response.data;

                setForm({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price || "",
                    category: product.category || "",
                    stock: product.stock || "",
                    imageUrl: product.imageUrl || ""
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setMessage("");

        try {
            await api.put(`/products/${id}`, {
                name: form.name,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                stock: Number(form.stock),
                imageUrl: form.imageUrl
            });

            setMessage("Product updated successfully!");

            setTimeout(() => {
                navigate("/seller");
            }, 1000);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Loading product...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-3xl mx-auto">

                <button
                    onClick={() => navigate("/seller")}
                    className="text-slate-400 hover:text-white mb-5"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold mb-2">
                    Edit Product
                </h1>

                <p className="text-slate-400 mb-8">
                    Update your green plant or handmade product.
                </p>

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
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
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
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
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
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
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
                                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
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
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
                        >
                            <option value="Green Plants">
                                Green Plants
                            </option>

                            <option value="Indoor Plants">
                                Indoor Plants
                            </option>

                            <option value="Outdoor Plants">
                                Outdoor Plants
                            </option>

                            <option value="Succulents">
                                Succulents
                            </option>

                            <option value="Handmade">
                                Handmade
                            </option>

                            <option value="Handmade Decor">
                                Handmade Decor
                            </option>

                            <option value="Handmade Gifts">
                                Handmade Gifts
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm text-slate-300">
                            Image URL
                        </label>

                        <input
                            type="url"
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none"
                        />
                    </div>

                    {message && (
                        <div className="text-emerald-400">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/seller")}
                            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditProduct;

