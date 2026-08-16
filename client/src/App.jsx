import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Seller from "./pages/Seller";
import Buyer from "./pages/Buyer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

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

            </Routes>
        </BrowserRouter>
    );
}

export default App;