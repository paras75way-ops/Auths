import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseApi";

// Types for admin API requests/responses
interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface UsersResponse {
  users: UserResponse[];
}

interface UpdateUserRoleRequest {
  newRole: string;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<UserResponse, void>({
      query: () => "/admin/profile",
    }),

    // Update user profile
    updateProfile: builder.mutation<UserResponse, Partial<UserResponse>>({
      query: (profileData) => ({
        url: "/admin/profile",
        method: "PUT",
        body: profileData,
      }),
    }),

    // Delete user profile
    deleteProfile: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/profile",
        method: "DELETE",
      }),
    }),

    // Get all users (admin only)
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => "/admin/users",
    }),

    // Update any user (admin only)
    updateAnyUser: builder.mutation<UserResponse, { userId: string } & Partial<UserResponse>>({
      query: ({ userId, ...userData }) => ({
        url: `/admin/users/${userId}`,
        method: "PUT",
        body: userData,
      }),
    }),

    // Delete any user (admin only)
    deleteAnyUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
    }),

    // Access admin panel
    accessAdminPanel: builder.query<{ message: string }, void>({
      query: () => "/admin/admin/panel",
    }),

    // View system logs
    viewSystemLogs: builder.query<{ logs: string[] }, void>({
      query: () => "/admin/admin/logs",
    }),

    // Manage user roles
    manageUserRole: builder.mutation<void, { userId: string } & UpdateUserRoleRequest>({
      query: ({ userId, ...roleData }) => ({
        url: `/admin/admin/users/${userId}/role`,
        method: "PUT",
        body: roleData,
      }),
    }),

    // Admin dashboard
    getAdminDashboard: builder.query<{ message: string }, void>({
      query: () => "/admin/admin/dashboard",
    }),

    // Admin reports
    getAdminReports: builder.query<{ message: string }, void>({
      query: () => "/admin/admin/reports",
    }),
  }),
});

// Export hooks for all admin endpoints
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetAllUsersQuery,
  useUpdateAnyUserMutation,
  useDeleteAnyUserMutation,
  useAccessAdminPanelQuery,
  useViewSystemLogsQuery,
  useManageUserRoleMutation,
  useGetAdminDashboardQuery,
  useGetAdminReportsQuery,
} = adminApi;
