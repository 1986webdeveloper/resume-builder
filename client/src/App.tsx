import { useRoutes } from "react-router-dom";
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
import Education from "./pages/masters/Education";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.value);

  const routes = isLoggedIn
    ? [
        {
          path: "/",
          element: <Layout />,
          children: [
            { index: true, element: <Dashboard /> },
            {
              path: "collections",
              element: <CollectionLayout />,
              children: [
                { index: true, element: <Masters /> },
                { path: ":collection", element: <Designations /> },
                { path: ":collection/:id", element: <AvailableFields /> },
                { path: "skills", element: <Skills /> },
                { path: "education", element: <Education /> },
              ],
            },
            { path: "resume", element: <ResumeBuilder /> },
          ],
        },
      ]
    : [
        {
          path: "/",
          element: <AuthLayout />,
          children: [
            { index: true, element: <Register /> },
            { path: "login", element: <Login /> },
            { path: "verify_token", element: <VerifyEmail /> },
          ],
        },
      ];

  const element = useRoutes(routes);

  return <>{element}</>;
}

export default App;
