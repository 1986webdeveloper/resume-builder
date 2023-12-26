import { MdAddCircle } from "react-icons/md";
import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  handleOpenAddModal: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function Header({
  handleOpenAddModal,
  title,
  description,
}: ComponentTypes) {
  return (
    <div className="max-w-full sm:text-center">
      <div className="flex justify-between items-center">
        <div className="self-center mx-auto">
          <h2 className="md:text-5xl text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          <div className="flex justify-center">
            <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
              {description}
            </p>
          </div>
        </div>
        <button
          className="mr-5 bg-primary px-5 py-3 text-center rounded-lg text-white flex gap-2 items-center"
          onClick={() => handleOpenAddModal()}
        >
          <MdAddCircle />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}