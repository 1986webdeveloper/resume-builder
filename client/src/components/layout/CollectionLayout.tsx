import { Outlet } from "react-router-dom";

export default function CollectionLayout() {
  return (
    <div className="py-20 px-10 w-full">
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
