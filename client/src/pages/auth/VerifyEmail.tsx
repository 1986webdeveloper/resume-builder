import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { passwordFields } from "../../config/fields";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../components/shared/Input";
import ButtonWithIcon from "../../components/shared/ButtonWithIcon";
import { FaUserPlus } from "react-icons/fa";
import { fieldTypes } from "../../types/fieldTypes";
import { verify } from "../../services/auth/verify";
import { toast } from "react-toastify";
import { resetPassword } from "../../services/auth/resetPassword";
import { forgotPassword } from "../../services/auth/forgotPassword";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const purpose = location?.state?.title;
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(
    purpose === "forgot" ? true : false
  );
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get("token");
  useEffect(() => {
    if (purpose !== "forgot") {
      verify(token)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Email Verified Successfully");
            setIsVerified(true);
          }
        })
        .catch(() => {
          navigate("/login");
        });
    }
  }, [token]);
  type Inputs = {
    password: string;
    confirmPassword: string;
    email: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true);
    if (purpose === "forgot") {
      forgotPassword(data.email)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message);
            setIsLoading(false);
            navigate("/login");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.error || "Something went wrong");
          setIsLoading(false);
        });
    } else {
      if (data.password !== data.confirmPassword) {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      resetPassword(data.password, token)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setIsLoading(false);
            navigate("/login");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.error || "Something went wrong");
          setIsLoading(false);
        });
    }
  };
  return (
    <div className="max-w-screen-lg min-h-[500px] m-0 sm:m-10 bg-white shadow-gray-700 shadow-xl sm:rounded-lg flex justify-center items-center flex-1">
      <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">
            {purpose === "forgot" ? "Type Your Email" : "Set Your Password"}
          </h1>
          <div className="w-full flex-1">
            {isVerified ? (
              <form
                className="mx-auto max-w-xs"
                onSubmit={handleSubmit(onSubmit)}
              >
                {purpose === "forgot" ? (
                  <Input
                    register={register}
                    type="email"
                    placeholder="email"
                    isRequired={true}
                    id="email"
                    color={errors.email ? "border-red-500" : ""}
                    errorPattern={/^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/}
                  />
                ) : (
                  passwordFields.map((field: fieldTypes, index: number) => (
                    <div key={index}>
                      <Input
                        register={register}
                        customClass={`${index !== 0 ? "mt-4" : ""}`}
                        type={field.type}
                        placeholder={field.placeholder}
                        isRequired={field.isRequired}
                        id={field.id}
                        color={
                          errors[field.id as keyof Inputs]
                            ? "border-red-500"
                            : ""
                        }
                        errorPattern={field.pattern}
                      />
                      {errors[field.id as keyof Inputs]?.type && (
                        <p className="text-red-600 mt-1 text-xs">
                          {errors[field.id as keyof Inputs]?.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
                {purpose !== "forgot" && isError && (
                  <p className="text-red-600 text-xs">
                    Password Did not match.
                  </p>
                )}
                <ButtonWithIcon
                  label="Continue"
                  icon={<FaUserPlus size={20} />}
                  color="bg-primary"
                  disable={isLoading}
                />
              </form>
            ) : (
              <h1>Verifying Email....</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
