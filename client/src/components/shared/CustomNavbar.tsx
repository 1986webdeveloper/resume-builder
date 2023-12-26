import { Button, Navbar } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CustomNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logout Successfully");
  };
  return (
    <Navbar fluid rounded className="shadow-xl border">
      <div className="flex justify-between w-full items-center px-6 py-3">
        <Navbar.Brand>
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Resume Builder
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Button gradientMonochrome="failure" onClick={onLogout}>
            Logout
          </Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3"
                : ""
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3"
                : ""
            }
          >
            Collections
          </NavLink>
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3"
                : ""
            }
          >
            Resume
          </NavLink>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
