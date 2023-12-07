import PropTypes, { InferProps } from "prop-types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../shared/Input";

const ComponentPropTypes = {
  handleModalClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function AddModal({
  handleModalClose,
  handleDelete,
}: ComponentTypes) {
  type Inputs = {
    title: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    // setIsLoading(true);
    // loginUser(data)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       console.log(res);
    //       toast.success(res.data.message);
    //       setIsLoading(false);
    //       dispatch(login());
    //       localStorage.setItem("token", res.data?.data?.token);
    //       navigate("/");
    //     }
    //   })
    //   .catch((err) => {
    //     toast.error(err.response?.data?.error || "Something went wrong");
    //     setIsLoading(false);
    //   });
  };

  const [isLoading, setIsLoading] = useState(false);
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
            <h2 className="text-xl font-bold py-4 ">Add Field</h2>
            <form
              className="mx-auto max-w-xs mt-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                register={register}
                type="text"
                isRequired={true}
                id="title"
                color={errors.title ? "border-red-500" : ""}
                errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              />
              {errors.title && (
                <p className="text-red-600 mt-1 text-xs">
                  {errors.title.message}
                </p>
              )}
              <div className="p-3  mt-2 text-center space-x-4 md:block">
                <button
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100"
                  onClick={() => handleModalClose()}
                >
                  Cancel
                </button>
                <button
                  className="mb-2 md:mb-0 bg-primary border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-hover-primary"
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
