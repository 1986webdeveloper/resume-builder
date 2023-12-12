import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import AuthLayout from "./components/layout/AuthLayout";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Dashboard from "./pages/dashboard/Index";
import Masters from "./pages/masters/Index";
import ResumeBuilder from "./pages/resumeBuilder/Index";
import CollectionLayout from "./components/layout/CollectionLayout";
import AvailableFields from "./pages/masters/AvailableFields";
import Designations from "./pages/masters/Designations";
import Skills from "./pages/masters/Skills";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.value);

  const routes = isLoggedIn ? (
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="collections" element={<CollectionLayout />}>
        <Route index element={<Masters />} />
        <Route path=":collection" element={<Designations />} />
        <Route path=":collection/:id" element={<AvailableFields />} />
        <Route path="skills" element={<Skills />} />
      </Route>
      <Route path="resume" element={<ResumeBuilder />} />
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
