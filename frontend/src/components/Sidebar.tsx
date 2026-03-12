import { NavLink } from "react-router";

export default function Sidebar() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
            ? "bg-indigo-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`;

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-shrink-0 sticky top-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                    MyApp
                </span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <NavLink to="/dashboard" className={linkClass}>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                </NavLink>
                 
            </nav>
        </aside>
    );
}
