import PropTypes, { InferProps } from "prop-types";
import { MdDelete, MdModeEditOutline } from "react-icons/md";

const ComponentPropTypes = {
  summary: PropTypes.string,
  id: PropTypes.string,
  handleOpenDeleteModal: PropTypes.func.isRequired,
  handleEditModalOpen: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function SummaryCard({
  summary,
  id,
  handleOpenDeleteModal,
  handleEditModalOpen,
}: ComponentTypes) {
  return (
    <div>
      <div
        key={id}
        className="bg-indigo-50 p-5 rounded-xl flex items-center justify-between"
      >
        <p
          className="capitalize"
          dangerouslySetInnerHTML={{ __html: summary as string }}
        />
        <div className="flex gap-2 ">
          <span
            className="cursor-pointer"
            onClick={() => handleOpenDeleteModal(id)}
          >
            <MdDelete size={18} />
          </span>
          <span
            className="cursor-pointer"
            onClick={() => handleEditModalOpen(id, summary)}
          >
            <MdModeEditOutline size={18} />
          </span>
        </div>
      </div>
    </div>
  );
}
