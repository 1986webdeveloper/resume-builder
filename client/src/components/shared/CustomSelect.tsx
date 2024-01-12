import { Label, Select } from "flowbite-react";

interface propTypes {
  label: string;
  isRequired: boolean;
  id: string;
  register: any;
  errors: any;
  defaultValue: string;
  initialOption: string;
  optionsKey: string;
  optionsData: any;
  disabled: boolean;
}

export default function CustomSelect({
  label,
  isRequired,
  id,
  register,
  errors,
  defaultValue,
  initialOption,
  optionsData,
  optionsKey,
  disabled = false,
}: propTypes) {
  return (
    <div>
      <div className="mb-2 block">
        <Label className="text-start" htmlFor={id} value={label} />
      </div>
      <Select
        id={id}
        {...register(id, {
          required: {
            value: isRequired,
            message: "This field is required",
          },
        })}
        defaultValue={defaultValue || ""}
        disabled={disabled}
        // color={errors?.country ? "failure" : ""}
      >
        <option value="" disabled>
          {initialOption}
        </option>
        {optionsData.map((item: any, index: number) => (
          <option key={index}>{optionsKey ? item[optionsKey] : item}</option>
        ))}
      </Select>
      {errors[id] && (
        <p className="text-red-600 mt-1 text-xs">{errors[id]?.message}</p>
      )}
    </div>
  );
}
