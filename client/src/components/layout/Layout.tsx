import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen text-gray-900 flex justify-center items-center bg-red-500">
      <Outlet />
    </div>
  );
}
