import { Label } from "flowbite-react";

interface propTypes {
  label: string;
  isRequired: boolean;
  id: string;
  register: any;
  errors: any;
  disabled: boolean;
}

export default function CustomDate({
  label,
  isRequired,
  id,
  register,
  errors,
  disabled,
}: propTypes) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={id} value={label} />
      </div>
      <input
        type="date"
        {...register(id, {
          required: {
            value: isRequired,
            message: "This field is required",
          },
        })}
        className={`rounded-lg w-full bg-white dark:bg-gray-700 dark:text-gray-100 ${
          disabled ? "border-gray-400 text-gray-400" : ""
        } `}
        disabled={disabled}
      />
      {errors[id]?.type && (
        <p className="text-red-600 mt-1 text-xs">
          {errors[id]?.message as string}
        </p>
      )}
    </div>
  );
}
