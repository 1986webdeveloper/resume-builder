import PropTypes, { InferProps } from "prop-types";
import { FaUserAlt } from "react-icons/fa";
import { MdDelete, MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { Button } from "flowbite-react";

const ComponentPropTypes = {
  title: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  designation: PropTypes.string,
  summary: PropTypes.string,
  onContinue: PropTypes.any,
  onDelete: PropTypes.any,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

export default function ResumeCard({
  title,
  email,
  phone,
  designation,
  summary,
  onContinue,
  onDelete,
}: ComponentTypes) {
  return (
    <div className="px-4 py-4 relative shadow-xl border border-gray-400 dark:bg-gray-800 rounded-lg cursor-pointer w-full transition-all duration-300 ease-in-out hover:bg-gray-50 hover:shadow-2xl hover:scale-105">
      <span
        className="cursor-pointer text-remove absolute right-2 top-2"
        onClick={onDelete}
      >
        <MdDelete size={18} />
      </span>
      <div className="flex flex-col gap-4 dark:text-gray-100">
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
        <div className="flex flex-col gap-2 max-h-[150px] min-h-[150px]">
          <span className="text-lg font-bold capitalize">{designation}</span>
          <span
            className="text-xs capitalize line-clamp-6 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: summary as string }}
          />
        </div>
        <Button
          outline
          className="bg-primary"
          color="dark"
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
