import PropTypes, { InferProps } from "prop-types";
import { FaUserAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import ButtonWithIcon from "./ButtonWithIcon";
import { Button } from "flowbite-react";

const ComponentPropTypes = {
  title: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  designation: PropTypes.string,
  summary: PropTypes.string,
  onContinue: PropTypes.any,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function ResumeCard({
  title,
  email,
  phone,
  designation,
  summary,
  onContinue,
}: ComponentTypes) {
  return (
    <div className="px-4 py-4 shadow-xl border border-gray-400 rounded-lg cursor-pointer w-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-6 items-center w-full">
          <span>
            <FaUserAlt size={60} color="gray" />
          </span>
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="flex gap-2 items-center text-sm">
              <FaUserAlt size={10} />
              <span>{title}</span>
            </div>
            <div className="flex gap-2 items-center text-sm w-full">
              <MdEmail size={10} />
              <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                {email}
              </span>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <FaPhone size={10} />
              <span>{phone}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold">{designation}</span>
          <span className="text-xs">{summary}</span>
        </div>
        <Button
          outline
          className=" bg-primary"
          color="dark"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
