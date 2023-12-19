import { Datepicker, Label, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../shared/RichTextEditor";
import ButtonWithIcon from "../../shared/ButtonWithIcon";
import { FaUserPlus } from "react-icons/fa6";
import { useState } from "react";

interface Inputs {
  companyName: string;
  from: string;
  to: string;
  summary: string;
}

export default function ExperienceForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const [textAreaData, setTextAreaData] = useState("");

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex justify-between mt-10 w-full">
      <form
        className="min-w-[25%] max-w-[26%] shadow-xl px-6 py-8 rounded-lg border self-center justify-center flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="full_name" value="Company Name" />
          </div>
          <TextInput
            {...register("companyName", {
              required: {
                value: true,
                message: "This field is required",
              },
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/,
                message: "There should be no empty spaces.",
              },
            })}
            id="companyName"
            type="text"
            color={errors?.companyName ? "failure" : ""}
          />
          {errors?.companyName && (
            <p className="text-red-600 mt-1 text-xs">
              {errors.companyName?.message}
            </p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="from" value="From" />
          </div>
          <Datepicker
            {...register("from", {
              required: {
                value: true,
                message: "This field is required",
              },
            })}
            id="dob"
            color={errors?.from ? "failure" : ""}
            onSelectedDateChanged={(selectedDate) => {
              const formattedDate = new Date(selectedDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
              setValue("from", formattedDate);
            }}
          />
          {errors.from?.type && (
            <p className="text-red-600 mt-1 text-xs">{errors.from?.message}</p>
          )}
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="to" value="To" />
          </div>
          <Datepicker
            {...register("to", {
              required: {
                value: true,
                message: "This field is required",
              },
            })}
            id="dob"
            color={errors?.to ? "failure" : ""}
            onSelectedDateChanged={(selectedDate) => {
              const formattedDate = new Date(selectedDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
              setValue("to", formattedDate);
            }}
          />
          {errors.to?.type && (
            <p className="text-red-600 mt-1 text-xs">{errors.to?.message}</p>
          )}
        </div>
        <div className="mt-3">
          <div className="mb-2 block">
            <Label value="Summary" />
          </div>
          <RichTextEditor
            setTextAreaData={setTextAreaData}
            // defaultData={clickedSummary.summary}
          />
        </div>
        <ButtonWithIcon
          label="Continue"
          icon={<FaUserPlus size={20} />}
          color="bg-primary"
        />
      </form>
    </div>
  );
}
