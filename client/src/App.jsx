import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import MyOrders from "./pages/MyOrders";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                 <Route
                    path="/"
                    element={
                        <ProtectedRoute role="Home ">
                            <Home  />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller"
                    element={
                        <ProtectedRoute role="seller">
                            <Seller />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/buyer"
                    element={
                        <ProtectedRoute role="buyer">
                            <Buyer />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/seller/add-product"
    element={
        <ProtectedRoute role="seller">
            <AddProduct />
        </ProtectedRoute>
    }
/>

                <Route
                    path="/seller/edit-product/:id"
                    element={
                        <ProtectedRoute role="seller">
                            <EditProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/seller/edit-product/:id"
    element={
        <ProtectedRoute role="seller">
            <EditProduct />
        </ProtectedRoute>
    }
/>
<Route
    path="/cart"
    element={
        <ProtectedRoute role="buyer">
            <Cart />
        </ProtectedRoute>
    }
/>
<Route
    path="/order-success"
    element={
        <ProtectedRoute role="buyer">
            <OrderSuccess  />
        </ProtectedRoute>
    }
/>
<Route
    path="/checkout"
    element={
        <ProtectedRoute role="buyer">
            <Checkout />
        </ProtectedRoute>
    }
/>

<Route
    path="/orders"
    element={
        <ProtectedRoute role="buyer">
            <Orders />
        </ProtectedRoute>
    }
/>

<Route
    path="/my-orders"
    element={
        <ProtectedRoute role="buyer">
            <MyOrders />
        </ProtectedRoute>
    }
/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;