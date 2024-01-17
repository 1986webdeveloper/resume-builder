import { MdAddCircle } from "react-icons/md";
import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  handleOpenAddModal: PropTypes.any,
  btnNeeded: PropTypes.bool,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function Header({
  handleOpenAddModal,
  title,
  btnNeeded = true,
}: ComponentTypes) {
  return (
    <div className="max-w-full relative mt-3">
      <h1 className="font-bold text-3xl text-center dark:text-gray-100">
        {title}
      </h1>
      {btnNeeded && (
        <button
          className="absolute top-0 right-1 bg-primary px-5 py-3 text-center rounded-lg text-white flex gap-2 items-center"
          onClick={() => handleOpenAddModal()}
        >
          <MdAddCircle />
          <span>Add</span>
        </button>
      )}
    </div>
  );
}
