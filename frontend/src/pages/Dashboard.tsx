import { useAuth } from "../store/hooks";
import { UserProfile } from "../components/AuthComponents";
import { AdminDashboard, UserManagement, AdminProfile } from "../components/AdminComponents";
import { AdminOnly, UserOnly } from "../common/components/RBACGuards";
import { useIsAdmin } from "../common/hooks/useRBAC";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Please login to access dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Dashboard */}
      <AdminOnly fallback={
        /* User Dashboard */
        <div className="space-y-6 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserProfile />
            
            {/* User Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">Recently</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="text-2xl mb-2">👤</div>
                <div className="font-medium">Edit Profile</div>
                <div className="text-sm text-gray-600">Update your information</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-medium">Change Password</div>
                <div className="text-sm text-gray-600">Update your password</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-medium">Email Settings</div>
                <div className="text-sm text-gray-600">Manage notifications</div>
              </button>
            </div>
          </div>
        </div>
      }>
        <div className="space-y-6 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminDashboard />
            <AdminProfile />
          </div>
          
          <UserManagement />
        </div>
      </AdminOnly>
    </div>
  );
}