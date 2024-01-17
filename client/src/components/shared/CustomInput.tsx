import { Label, TextInput } from "flowbite-react";

interface propTypes {
  type: string;
  label?: string;
  customClass?: string;
  placeholder?: string;
  isRequired: boolean;
  id: string;
  register: any;
  errors: any;
  errorPattern: any;
  errMsg?: string;
}

export default function CustomInput({
  type,
  label,
  customClass = "",
  placeholder = "",
  isRequired,
  id,
  register,
  errors,
  errorPattern,
  errMsg,
}: propTypes) {
  return (
    <div className={customClass}>
      {label && (
        <div className="mb-2 block">
          <Label htmlFor={id} value={label} />
        </div>
      )}
      <TextInput
        {...register(id, {
          required: {
            value: isRequired,
            message: "This field is required",
          },
          pattern: {
            value: errorPattern,
            message: errMsg ? errMsg : "There should be no empty spaces.",
          },
        })}
        id={id}
        type={type}
        placeholder={placeholder}
        // color={errors?.full_name ? "failure" : ""}
      />
      {errors[id] && (
        <p className="text-red-600 mt-1 text-xs">{errors[id]?.message}</p>
      )}
    </div>
  );
}
