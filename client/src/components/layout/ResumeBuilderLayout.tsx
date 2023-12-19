import { Outlet } from "react-router-dom";

export default function ResumeBuilderLayout() {
  return (
    <div className="py-20 px-10 w-full">
      <div className="container w-full">
        <Outlet />
      </div>
    </div>
  );
}
