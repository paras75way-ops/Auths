import { useNavigate } from "react-router";
import { useAuth } from "../store/hooks";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout, isLoading } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/signin");
    };

    if (!user) {
        return null; // Don't render navbar if user is not authenticated
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full shadow-sm">
            <div className="flex items-center">
                
                <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block">
                        <span className="text-sm font-medium text-gray-700 block">
                            {user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                            {user.role}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </header>
    );
}
