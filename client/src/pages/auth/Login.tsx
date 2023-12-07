import { NavLink, useNavigate } from "react-router-dom";
import Input from "../../components/shared/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginFields } from "../../config/fields";
import { FaUserPlus } from "react-icons/fa";
import ButtonWithIcon from "../../components/shared/ButtonWithIcon";
import { fieldTypes } from "../../types/fieldTypes";
import { useState } from "react";
import { loginUser } from "../../services/auth/loginUser";
import { toast } from "react-toastify";
import { login } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";

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
          console.log(res);
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
    <div className="max-w-screen-lg m-0 sm:m-10 bg-white shadow-gray-700 shadow-xl sm:rounded-lg flex justify-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Sign In</h1>
          <div className="w-full flex-1">
            <div className="my-12 border-b text-center">
              <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                sign in with e-mail
              </div>
            </div>

            <form
              className="mx-auto max-w-xs"
              onSubmit={handleSubmit(onSubmit)}
            >
              {loginFields.map((field: fieldTypes, index: number) => (
                <div key={index}>
                  <Input
                    register={register}
                    customClass={`${index !== 0 ? "mt-4" : ""}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    isRequired={field.isRequired}
                    id={field.id}
                    color={
                      errors[field.id as keyof Inputs] ? "border-red-500" : ""
                    }
                    errorPattern={field.pattern}
                  />
                  {errors[field.id as keyof Inputs]?.type && (
                    <p className="text-red-600 mt-1 text-xs">
                      {errors[field.id as keyof Inputs]?.message}
                    </p>
                  )}
                </div>
              ))}
              <ButtonWithIcon
                label="Sign In"
                icon={<FaUserPlus size={20} />}
                color="bg-primary"
                disable={isLoading}
              />
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
      <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
        <div
          className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
          }}
        ></div>
      </div>
    </div>
  );
}
