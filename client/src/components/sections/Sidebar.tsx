import { RiDashboardLine } from "react-icons/ri";
import { HiOutlineCollection } from "react-icons/hi";
import { FaRegFile } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="flex flex-no-wrap">
      <div className="w-64 min-h-screen absolute sm:relative text-white font-bold bg-indigo-400 shadow-xl shadow-gray-400  md:h-full flex-col justify-between hidden sm:flex">
        <div className="">
          <div className="h-16 w-full cursor-pointer border-b-4 border-black">
            <h1 className="text-center mt-6 text-lg">Resume</h1>
          </div>
          <ul>
            <div className="hover:bg-indigo-200 hover:text-black px-6 pt-2 cursor-pointer">
              <NavLink to="/">
                <li className="flex w-full justify-between gap-3 text-center items-center my-6">
                  <RiDashboardLine size={20} />
                  <span className="text-sm ml-2">Dashboard</span>
                </li>
                <hr />
              </NavLink>
            </div>
            <div className="hover:bg-indigo-200 hover:text-black px-6 pt-2 cursor-pointer">
              <NavLink to="/collections">
                <li className="flex w-full justify-between gap-3 items-center my-6">
                  <HiOutlineCollection size={20} />
                  <span className="text-sm ml-2">Collections</span>
                </li>
                <hr />
              </NavLink>
            </div>
            <div className="hover:bg-indigo-200 hover:text-black px-6 pt-2 cursor-pointer">
              <NavLink to="/resume">
                <li className="flex w-full justify-between gap-3 items-center my-6">
                  <FaRegFile size={20} />
                  <span className="text-sm ml-2">Resume</span>
                </li>
                <hr />
              </NavLink>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
