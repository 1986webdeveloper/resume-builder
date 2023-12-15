import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  handleModalClose: PropTypes.func.isRequired,
  modalTitle: PropTypes.string,
  children: PropTypes.any,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function EditModal({
  handleModalClose,
  modalTitle,
  children,
}: ComponentTypes) {
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
        {/* <!--content--> */}
        <div className="">
          {/* <!--body--> */}
          <div className="text-center p-5 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold py-4 ">{modalTitle}</h2>
            <form>{children}</form>
          </div>
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
              className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
              onClick={() => handleModalClose()}
            >
              Cancel
            </button>
            <button
              className="mb-2 md:mb-0 bg-primary border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-hover-primary"
              type="submit"
            >
              edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
