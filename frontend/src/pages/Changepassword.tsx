import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../store/hooks";
import { changePasswordSchema, type ChangePasswordFormData } from "../common/validation";
import { useErrorHandler, ErrorType } from "../common/errors";

export default function ChangePassword() {
  const { changePassword, isLoading, error, clearError } = useAuth();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      clearError();
      await changePassword(data);
      // Show success message
      setError("root", { 
        type: "custom",
        message: "Password changed successfully!" 
      });
    } catch (error: any) {
      handleError(error, "Change Password", ErrorType.VALIDATION);
      // Set form error if available
      if (error?.data?.message) {
        setError("root", { message: error.data.message });
      }
    }
  };

  const hasSuccessMessage = errors.root?.type === "custom" && errors.root?.message?.includes("successfully");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800">
        
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
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
                {errors.currentPassword.message as string}
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
                {errors.newPassword.message as string}
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

        {/* Success/Error Message */}
        {(error || errors.root?.message) && (
          <p className={`mt-4 text-sm text-center ${
            hasSuccessMessage ? "text-green-400" : "text-red-400"
          }`}>
            {error || errors.root?.message}
          </p>
        )}
      </div>
    </div>
  );
}