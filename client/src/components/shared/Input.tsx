import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  type: PropTypes.string,
  customClass: PropTypes.string,
  placeholder: PropTypes.string,
  isRequired: PropTypes.bool,
  id: PropTypes.string,
  register: PropTypes.any,
  color: PropTypes.string,
  errorPattern: PropTypes.any,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function Input({
  type,
  customClass,
  placeholder,
  isRequired,
  id,
  register,
  color,
  errorPattern,
}: ComponentTypes) {
  const fixedInputClass = `w-full px-8 py-4 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:bg-white ${color} `;
  return (
    <input
      {...register(id, {
        required: { value: isRequired, message: "This field is required." },
        minLength: 2,
        pattern: {
          value: errorPattern,
          message: "Value should be valid and no empty spaces.",
        },
      })}
      id={id}
      type={type}
      step="any"
      className={fixedInputClass + customClass}
      placeholder={placeholder}
    />
  );
}

Input.propTypes = ComponentPropTypes;
