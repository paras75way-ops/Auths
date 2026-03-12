import { createBrowserRouter } from "react-router";
import PublicLayout from "../layouts/Publiclayout";
import PrivateLayout from "../layouts/Privatelayout";
import SignIn from "../pages/Signin";
import SignUp from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ChangePassword from "../pages/Changepassword";
import VerifyEmail from "../pages/VerifyEmail";

export const router = createBrowserRouter([
  {
    path: "/verify-otp",
    element: <VerifyEmail />,
  },
  {
    element: <PublicLayout />,
    children: [
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
    ],
  },
  {
    element: <PrivateLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/change-password", element: <ChangePassword /> },
    ],
  },
]);