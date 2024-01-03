import { MdEdit } from "react-icons/md";
import { personalFormTypes } from "../../../types/formTypes";

interface extendedType extends personalFormTypes {
  countries: any;
  states: any;
}

interface propTypes {
  data: extendedType;
  id: string;
  onedit: () => void;
}

export default function PersonalCard({ data, id, onedit }: propTypes) {
  return (
    <div className="relative px-4 py-3  shadow-xl rounded-lg border text-sm">
      <h1 className="font-bold text-lg text-center">Personal</h1>
      <span
        className="cursor-pointer text-edit absolute right-2 top-2"
        onClick={onedit}
      >
        <MdEdit size={18} />
      </span>
      <div className="flex gap-3 mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">Full Name : </p>
            <span>{data?.full_name}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">Email : </p>
            <span>{data?.email}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">Mobile : </p>
            <span>{data?.mobileNo}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">Address : </p>
            <span>{data?.address}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">Country : </p>
            <span>{data?.countries?.name}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">State : </p>
            <span>{data?.states?.name}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">City : </p>
            <span>{data?.city}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm font-bold">DOB : </p>
            <span>{data?.dob}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
