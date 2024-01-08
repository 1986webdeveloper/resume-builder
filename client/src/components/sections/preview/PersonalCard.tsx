import { MdEdit } from "react-icons/md";
import { personalFormTypes } from "../../../types/formTypes";
import PreviewCard from "../../shared/PreviewCard";
import { BsDatabaseExclamation } from "react-icons/bs";

interface extendedType extends personalFormTypes {
  countries: any;
  states: any;
}

interface propTypes {
  data: extendedType;
  onedit: () => void;
}

export default function PersonalCard({ data, onedit }: propTypes) {
  return (
    <PreviewCard>
      <h1 className="font-bold text-lg text-center font-mono">Personal</h1>
      <hr className="mt-2" />
      {data ? (
        <>
          <span
            className="cursor-pointer text-edit absolute right-4 top-2 p-1 hover:bg-gray-200 rounded-lg"
            onClick={onedit}
          >
            <MdEdit size={18} />
          </span>
          <div className="flex justify-center items-center gap-5 mt-6">
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
        </>
      ) : (
        <div className="w-full min-h-[200px] flex justify-center items-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <BsDatabaseExclamation color="gray" size={30} />
            <p className="text-sm text-center ml-2 text-gray-400">
              Please Fill the datails.
            </p>
          </div>
        </div>
      )}
    </PreviewCard>
  );
}
