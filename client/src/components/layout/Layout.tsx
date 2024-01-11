import { Outlet } from "react-router-dom";
import CustomNavbar from "../shared/CustomNavbar";

export default function Layout() {
  return (
    <div className="w-full min-h-screen dark:bg-gray-900">
      <CustomNavbar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
