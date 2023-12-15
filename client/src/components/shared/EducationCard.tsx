import { MdDelete, MdModeEditOutline, MdAddCircle } from "react-icons/md";
import PropTypes, { InferProps } from "prop-types";
import { NavLink } from "react-router-dom";

const ComponentPropTypes = {
  title: PropTypes.string,
  id: PropTypes.string,
  handleOpenDeleteModal: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function EducationCard({
  title,
  id,
  handleOpenDeleteModal,
}: ComponentTypes) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 shadow-xl border rounded-lg">
      <NavLink to={`${title}`} state={{ id: id }}>
        <div className="flex gap-2 items-center justify-between">
          <h1 className="font-bold text-lg capitalize">{title}</h1>
          <div className="flex gap-2">
            <span
              className="cursor-pointer"
              onClick={() => handleOpenDeleteModal(id)}
            >
              <MdDelete size={18} />
            </span>
          </div>
        </div>
      </NavLink>
    </div>
  );
}
