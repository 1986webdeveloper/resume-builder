import PropTypes, { InferProps } from "prop-types";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import ButtonWithIcon from "./ButtonWithIcon";

const ComponentPropTypes = {
  title: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  designation: PropTypes.string,
  summary: PropTypes.string,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function ResumeCard({
  title,
  email,
  phone,
  designation,
  summary,
}: ComponentTypes) {
  return (
    <div className="px-4 py-4 shadow-xl border border-gray-400 rounded-lg cursor-pointer">
      <div className="flex flex-col gap-4">
        <div className="flex gap-6 items-center">
          <span>
            <FaUserAlt size={60} color="gray" />
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <FaUserAlt size={10} />
              <span>{title}</span>
            </div>
            <div className="flex gap-2 items-center">
              <MdEmail size={10} />
              <span>{email}</span>
            </div>
            <div className="flex gap-2 items-center">
              <FaPhone size={10} />
              <span>{phone}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">{designation}</span>
          <span className="text-sm">{summary}</span>
        </div>
        <ButtonWithIcon
          label="Continue"
          icon={<FaArrowRight />}
          color="bg-primary"
          customClass="mt-0 py-[10px]"
        />
      </div>
    </div>
  );
}
