import { useAuth } from "../context/AuthContext";

function Logout() {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-red-400 hover:bg-red-500/10 hover:text-red-300
                       transition duration-200"
        >
            <span>↪</span>
            <span>Logout</span>
        </button>
    );
}

export default Logout;