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
  handleOpenDeleteModal: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function Card({
  title,
  description,
  route,
  id,
  handleOpenDeleteModal,
}: ComponentTypes) {
  return (
    <div>
      <div className="p-7 rounded-xl border shadow-gray-200 shadow-xl bg-white ">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold capitalize">{title}</h3>
          <div className="flex gap-2">
            <span
              className="cursor-pointer"
              onClick={() => handleOpenDeleteModal(id)}
            >
              <MdDelete size={18} />
            </span>
            <span className="cursor-pointer">
              <MdModeEditOutline size={18} />
            </span>
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
    </div>
  );
}
