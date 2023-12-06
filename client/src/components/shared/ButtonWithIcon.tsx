import PropTypes, { InferProps } from "prop-types";

const ComponentPropTypes = {
  label: PropTypes.string,
  icon: PropTypes.any,
  customClass: PropTypes.string,
  color: PropTypes.string,
  disable: PropTypes.bool,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function ButtonWithIcon({
  label,
  icon,
  color,
  disable = false,
}: ComponentTypes) {
  return (
    <button
      className={`mt-5 tracking-wide font-semibold ${
        disable
          ? "bg-indigo-200 cursor-not-allowed"
          : `${color} hover:bg-hover-primary`
      } text-gray-100 w-full py-4 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
      disabled={disable as boolean}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
}
