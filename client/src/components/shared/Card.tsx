import { FaArrowRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import PropTypes, { InferProps } from "prop-types";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";

const ComponentPropTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  route: PropTypes.string,
  id: PropTypes.string,
  handleOpenDeleteModal: PropTypes.any,
  isEditable: PropTypes.bool,
  isDeletable: PropTypes.bool,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function Card({
  title,
  description,
  route,
  id,
  handleOpenDeleteModal,
  isEditable = true,
  isDeletable = true,
}: ComponentTypes) {
  return (
    <div className=" p-7 rounded-xl border shadow-gray-200 dark:shadow-gray-900 shadow-xl bg-white dark:bg-gray-800 dark:text-gray-100 transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-2xl hover:scale-105">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold capitalize">{title}</h3>
        <div className="flex gap-2">
          {isDeletable && (
            <span
              className="cursor-pointer text-remove"
              onClick={() => handleOpenDeleteModal(id, "delete")}
            >
              <MdDelete size={18} />
            </span>
          )}
          {isEditable && (
            <span className="cursor-pointer text-edit">
              <MdModeEditOutline size={18} />
            </span>
          )}
        </div>
      </div>

      <p className="text-sm leading-7 text-gray-500 my-6 ">{description}</p>
      <NavLink
        to={route as string}
        className="py-3 flex items-center justify-center w-full font-semibold text-white rounded-md bg-primary hover:bg-hover-primary hover:text-white transition-all duration-500 "
      >
        <span className="mr-5">Continue</span>
        <FaArrowRight />
      </NavLink>
    </div>
  );
}
