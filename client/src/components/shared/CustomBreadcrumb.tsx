import { Breadcrumb } from "flowbite-react";
import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

export default function CustomBreadcrumb() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <Breadcrumb
      aria-label="Solid background breadcrumb example"
      className="bg-gray-50 px-5 py-3 dark:bg-gray-800 w-fit"
    >
      {breadcrumbs.map(({ breadcrumb, match }, index) => (
        <Breadcrumb.Item key={index} href="#">
          <NavLink
            className="font-bold"
            key={match.pathname}
            to={match.pathname}
          >
            {breadcrumb}
          </NavLink>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
