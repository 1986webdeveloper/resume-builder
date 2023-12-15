import { NavLink } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";

export default function Breadcrumb() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <nav className="bg-gray-100 p-3 rounded font-sans w-fit m-4">
      <ol className="list-reset flex text-grey-dark">
        {breadcrumbs.map(({ breadcrumb, match }, index) => (
          <>
            <li>
              <NavLink
                className="text-indigo-400 font-bold"
                key={match.pathname}
                to={match.pathname}
              >
                {breadcrumb}
              </NavLink>
            </li>
            {index < breadcrumbs.length - 1 && (
              <li>
                <span className="mx-2">{">"}</span>
              </li>
            )}
          </>
        ))}
      </ol>
    </nav>
  );
}
