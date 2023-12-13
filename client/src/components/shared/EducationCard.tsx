import { MdDelete, MdModeEditOutline, MdAddCircle } from "react-icons/md";
import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  title: PropTypes.string,
  summary: PropTypes.any,
  score: PropTypes.any,
  id: PropTypes.string,
  handleOpenDeleteModal: PropTypes.func.isRequired,
  handleEditModalOpen: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function EducationCard({
  title,
  summary,
  score,
  id,
  handleOpenDeleteModal,
  handleEditModalOpen,
}: ComponentTypes) {
  console.log(summary, "summary");
  return (
    <div className="flex flex-col gap-2 px-4 py-4 shadow-xl border rounded-lg">
      <div className="flex gap-2 items-center justify-between">
        <h1 className="font-bold text-lg capitalize">{title}</h1>
        <div className="flex gap-2">
          <span
            className="cursor-pointer"
            onClick={() => handleOpenDeleteModal(id)}
          >
            <MdDelete size={18} />
          </span>
          <span
            className="cursor-pointer"
            onClick={() =>
              handleEditModalOpen(id, {
                summary: summary,
                score: score,
                title: title,
              })
            }
          >
            <MdModeEditOutline size={18} />
          </span>
        </div>
      </div>

      <label className="mt-2">
        <input className="peer/showLabel absolute scale-0" type="checkbox" />
        <span className="block max-h-14 max-w-xs overflow-hidden rounded-lg bg-indigo-100 px-2 py-0 text-cyan-800 shadow-lg transition-all duration-300 text-sm peer-checked/showLabel:max-h-fit">
          <div className="flex justify-between items-center">
            <h3 className="flex h-14 cursor-pointer items-center font-bold">
              Summaries
            </h3>
            <div className="flex gap-2">
              <span
                className="cursor-pointer"
                // onClick={() => handleOpenDeleteModal(id)}
              >
                <MdAddCircle size={18} />
              </span>
            </div>
          </div>
          <ul className="list-disc!" style={{ listStyle: "disc" }}>
            {summary?.map((item: string) => (
              <li className="mb-2 list-disc!">{item.summary}</li>
            ))}
          </ul>
        </span>
      </label>
      <label className="mt-2">
        <input className="peer/showLabel absolute scale-0" type="checkbox" />
        <span className="block max-h-14 max-w-xs overflow-hidden rounded-lg bg-indigo-100 px-2 py-0 text-cyan-800 shadow-lg transition-all duration-300 text-sm peer-checked/showLabel:max-h-fit">
          <h3 className="flex h-14 cursor-pointer items-center font-bold">
            Scores
          </h3>
          <ul className="list-disc!" style={{ listStyle: "disc" }}>
            {score?.map((item) => (
              <li className="mb-2 list-disc!">
                {`${item.value} ${item.label}`}{" "}
              </li>
            ))}
          </ul>
        </span>
      </label>
    </div>
  );
}
