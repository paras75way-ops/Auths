import React from "react";
import {
  useGetProfileQuery,
  useGetAllUsersQuery,
  useUpdateAnyUserMutation,
  useDeleteAnyUserMutation,
  useManageUserRoleMutation,
  useGetAdminDashboardQuery,
  useAccessAdminPanelQuery,
} from "../store/api/adminApi";

// Example Admin Dashboard Component
export const AdminDashboard: React.FC = () => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useGetAdminDashboardQuery();
  const { data: panelData, isLoading: panelLoading } = useAccessAdminPanelQuery();
  
  if (dashboardLoading || panelLoading) return <div>Loading admin dashboard...</div>;
  if (dashboardError) return <div>Error loading dashboard</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Dashboard Info</h3>
          <p className="text-blue-600">{dashboardData?.message}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-semibold text-green-800">Panel Access</h3>
          <p className="text-green-600">{panelData?.message}</p>
        </div>
      </div>
    </div>
  );
};

// Example User Management Component
export const UserManagement: React.FC = () => {
  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUser] = useUpdateAnyUserMutation();
  const [deleteUser] = useDeleteAnyUserMutation();
  const [manageRole] = useManageUserRoleMutation();

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      await updateUser({ userId, ...userData }).unwrap();
      refetch(); // Refresh the users list
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        refetch(); // Refresh the users list
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await manageRole({ userId, newRole }).unwrap();
      refetch(); // Refresh the users list
    } catch (error) {
      console.error("Failed to change user role:", error);
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersData?.users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleUpdateUser(user.id, { name: `${user.name} (Updated)` })}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Example Admin Profile Component
export const AdminProfile: React.FC = () => {
  const { data: profileData, isLoading, error } = useGetProfileQuery();

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      
      <div className="space-y-2">
        <div>
          <span className="font-semibold">ID:</span> {profileData?.id}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {profileData?.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {profileData?.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {profileData?.role}
        </div>
        <div>
          <span className="font-semibold">Verified:</span> {profileData?.isVerified ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

// Example System Logs Component
export const SystemLogs: React.FC = () => {
  const { data: logsData, isLoading, error } = useViewSystemLogsQuery();

  if (isLoading) return <div>Loading system logs...</div>;
  if (error) return <div>Error loading system logs</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">System Logs</h2>
      
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
        {logsData?.logs?.map((log, index) => (
          <div key={index} className="mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
