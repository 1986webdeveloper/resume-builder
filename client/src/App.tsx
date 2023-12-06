import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import AuthLayout from "./components/layout/AuthLayout";
import VerifyEmail from "./pages/auth/VerifyEmail";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.value);

  const routes = isLoggedIn ? (
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
    </Route>
  ) : (
    <Route path="/" element={<AuthLayout />}>
      <Route index element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="verify_token" element={<VerifyEmail />} />
    </Route>
  );
  const router = createBrowserRouter(createRoutesFromElements(routes));
  return <RouterProvider router={router} />;
}

export default App;
