import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useErrorHandler, ErrorType } from "../errors";

// Custom hook for form validation with Zod
export const useValidatedForm = <T extends z.ZodType<any, any, any>>(
  schema: T,
  options?: {
    defaultValues?: any;
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
    reValidateMode?: "onChange" | "onBlur" | "onSubmit";
  }
) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: options?.defaultValues,
    mode: options?.mode || "onBlur",
    reValidateMode: options?.reValidateMode || "onChange",
  });

  const clearServerError = () => setServerError(null);

  const setServerErrorFromResponse = (error: any) => {
    if (error?.data?.message) {
      setServerError(error.data.message);
    } else if (error?.message) {
      setServerError(error.message);
    } else {
      setServerError("An unexpected error occurred");
    }
  };

  const handleSubmitWithLoading = async (
    onSubmit: (data: any) => Promise<void>
  ) => {
    setIsSubmitting(true);
    clearServerError();
    
    try {
      await form.handleSubmit(onSubmit)();
    } catch (error) {
      // Handle error with the error handler
      handleError(error, "Form Submission", ErrorType.VALIDATION);
      setServerErrorFromResponse(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a synchronous submit handler for the form
  const createSubmitHandler = (onSubmit: (data: any) => Promise<void>) => {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmitWithLoading(onSubmit);
    };
  };

  return {
    ...form,
    serverError,
    setServerError,
    clearServerError,
    setServerErrorFromResponse,
    isSubmitting,
    handleSubmitWithLoading,
    createSubmitHandler,
  };
};

// Utility function to validate form data manually
export const validateFormData = <T extends z.ZodType<any, any, any>>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ["Validation failed"] };
  }
};
