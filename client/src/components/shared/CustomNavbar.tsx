import { Button, Navbar } from "flowbite-react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { IoMdSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { useState } from "react";

export default function CustomNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const onLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logout Successfully");
  };

  const themeToggle = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
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
          <div className="flex gap-2 items-center">
            <Button outline color="failure" onClick={onLogout}>
              Logout
            </Button>
            <span onClick={themeToggle}>
              {theme === "light" ? (
                <Button color="dark" outline pill>
                  <FaMoon />
                </Button>
              ) : (
                <Button color="dark" outline pill>
                  <IoMdSunny />
                </Button>
              )}
            </span>
            <Navbar.Toggle />
          </div>
        </div>
        <Navbar.Collapse>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3 dark:text-gray-100"
                : "dark:text-gray-100"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3 dark:text-gray-100"
                : "dark:text-gray-100"
            }
          >
            Collections
          </NavLink>
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-green-400 font-extrabold border-3 dark:text-gray-100"
                : "dark:text-gray-100"
            }
          >
            Resume
          </NavLink>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
