import { NavLink, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { signupFields } from "../../config/fields";
import { FaUserPlus } from "react-icons/fa";
import { fieldTypes } from "../../types/fieldTypes";
import { useState } from "react";
import { registerUser } from "../../services/auth/registerUser";
import { toast } from "react-hot-toast";
import bgImg from "../../assets/bg.jpg";
import { Button } from "flowbite-react";
import CustomInput from "../../components/shared/CustomInput";

export default function Register() {
  interface Inputs {
    firstName: string;
    lastName: string;
    email: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    setIsLoading(true);
    registerUser(data)
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          toast.success(res.data.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error(err.response?.data?.error || "Something went wrong");
      });
  };

  return (
    <div className="max-w-screen-lg m-0 sm:m-10 bg-white dark:bg-gray-800 shadow-gray-700 shadow-xl sm:rounded-lg flex justify-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign Up</h1>
          <div className="w-full flex-1">
            <form
              className="mx-auto max-w-xs mt-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              {signupFields.map((field: fieldTypes, index: number) => (
                <div key={index}>
                  <CustomInput
                    type={field.type}
                    customClass={`${index !== 0 ? "mt-4" : ""}`}
                    placeholder={field.placeholder}
                    isRequired={field.isRequired}
                    id={field.id}
                    register={register}
                    errors={errors}
                    errorPattern={field.pattern}
                    errMsg="Value should be valid and no empty spaces."
                  />
                </div>
              ))}
              <Button
                className="w-full mt-5"
                color="dark"
                disabled={isLoading}
                type="submit"
              >
                <span className="mr-2">
                  <FaUserPlus size={20} />
                </span>
                Sign In
              </Button>
              <p className="mt-6 text-xs text-gray-600 text-center">
                Already have an account ?
                <NavLink
                  to="/login"
                  className="border-b border-gray-500 border-dotted"
                >
                  {" "}
                  Login
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div
          className="w-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>
        {/* <div
          className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
          }}
        ></div> */}
      </div>
    </div>
  );
}
