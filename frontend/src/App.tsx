import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ErrorProvider, ErrorBoundary, ErrorDisplay } from "./common/errors";
import "./index.css";

export default function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <ErrorDisplay />
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ErrorProvider>
  );
}