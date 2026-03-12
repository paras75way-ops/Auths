import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { AppError } from "./errorHandler";

// Generic validation middleware factory
export const validate = <T>(schema: z.ZodType<T>, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: unknown;
      
      switch (source) {
        case "body":
          data = req.body;
          break;
        case "query":
          data = req.query;
          break;
        case "params":
          data = req.params;
          break;
        default:
          data = req.body;
      }

      const validatedData = schema.parse(data) as T;
      
      // Replace the request data with validated data
      switch (source) {
        case "body":
          req.body = validatedData;
          break;
        case "query":
          // For query params, we need to cast to the expected type
          Object.keys(validatedData as Record<string, unknown>).forEach(key => {
            (req.query as Record<string, unknown>)[key] = (validatedData as Record<string, unknown>)[key];
          });
          break;
        case "params":
          // For route params, we need to cast to the expected type
          Object.keys(validatedData as Record<string, unknown>).forEach(key => {
            (req.params as Record<string, unknown>)[key] = (validatedData as Record<string, unknown>)[key];
          });
          break;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        throw new AppError(
          `Validation failed: ${error.issues.map((e) => e.message).join(', ')}`,
          400
        );
      }
      next(error);
    }
  };
};
