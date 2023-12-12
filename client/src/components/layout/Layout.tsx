import { Outlet } from "react-router-dom";
import Sidebar from "../sections/Sidebar";

export default function Layout() {
  return (
    <div className="w-full h-full flex">
      <Sidebar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
