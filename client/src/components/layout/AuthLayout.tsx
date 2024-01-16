import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen text-gray-900 dark:text-gray-100 dark:bg-gray-900 flex justify-center items-center">
      <Outlet />
    </div>
  );
}
