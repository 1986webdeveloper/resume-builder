import { NavLink, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginFields } from "../../config/fields";
import { FaUserPlus } from "react-icons/fa";
import { fieldTypes } from "../../types/fieldTypes";
import { useState } from "react";
import { loginUser } from "../../services/auth/loginUser";
import { toast } from "react-hot-toast";
import { login } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import bgImg from "../../assets/bg.jpg";
import { Button } from "flowbite-react";
import CustomInput from "../../components/shared/CustomInput";

export default function Login() {
  type Inputs = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    loginUser(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setIsLoading(false);
          dispatch(login());
          localStorage.setItem("token", res.data?.data?.token);
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "Something went wrong");
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-screen-lg m-0 sm:m-10 bg-white shadow-gray-700 dark:bg-gray-800 dark:shadow-gray-900 shadow-xl sm:rounded-lg flex justify-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
          <div className="w-full flex-1">
            <form
              className="mx-auto max-w-xs mt-12"
              onSubmit={handleSubmit(onSubmit)}
            >
              {loginFields.map((field: fieldTypes, index: number) => (
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
              <div className="flex justify-between">
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Don't have an account ?
                  <NavLink
                    to="/"
                    className="border-b border-gray-500 border-dotted"
                  >
                    {" "}
                    SignUp
                  </NavLink>
                </p>
                <NavLink
                  to={{ pathname: "/verify_token" }}
                  state={{ title: "forgot" }}
                  className=" mt-6 text-xs text-gray-600 text-center border-b border-gray-500 border-dotted"
                >
                  {" "}
                  Forgot Password
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-indigo-100 dark:bg-gray-800 text-center hidden lg:flex">
        <div
          className="w-full bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${bgImg})`,
          }}
        ></div>
      </div>
    </div>
  );
}
