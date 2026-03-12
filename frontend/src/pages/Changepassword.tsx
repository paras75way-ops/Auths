import { useValidatedForm } from "../common/hooks/useValidatedForm";
import { useAuth } from "../store/hooks";
import { changePasswordSchema, type ChangePasswordFormData } from "../common/validation";

export default function ChangePassword() {
  const { changePassword, isLoading, error, clearError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    serverError,
    setServerError,
    clearServerError,
    isSubmitting,
    handleSubmitWithLoading,
  } = useValidatedForm(changePasswordSchema, {
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    clearError();
    setServerError(null);

    try {
      await changePassword(data);
      setServerError("Password changed successfully!");
      // Reset form after successful change
      // Note: You might want to add a reset function to the hook
    } catch (error: any) {
      setServerError(error.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmitWithLoading(onSubmit)} className="space-y-5">
          
          {/* Current Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Current Password
            </label>
            <input
              type="password"
              {...register("currentPassword")}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter current password"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              New Password
            </label>
            <input
              type="password"
              {...register("newPassword")}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </form>

        {/* Success Message */}
        {serverError && (
          <p className={`mt-4 text-sm text-center ${
            serverError.includes("successfully") ? "text-green-400" : "text-red-400"
          }`}>
            {serverError}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}