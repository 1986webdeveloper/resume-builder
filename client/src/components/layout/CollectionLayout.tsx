import { Outlet } from "react-router-dom";

export default function CollectionLayout() {
  return (
    <div className="px-6 py-3 w-full">
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
