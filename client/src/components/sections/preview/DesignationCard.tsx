import { MdEdit } from "react-icons/md";
import { designationFormTypes } from "../../../types/formTypes";
import PreviewCard from "../../shared/PreviewCard";
import { BsDatabaseExclamation } from "react-icons/bs";

interface extendedTypes extends designationFormTypes {
  designationData: any;
  customSummary: string;
}

interface propType {
  data: extendedTypes;
  onedit: () => void;
}

export default function DesignationCard({ data, onedit }: propType) {
  return (
    <PreviewCard>
      <h1 className="font-bold text-lg text-center font-mono">Designation</h1>
      <hr className="mt-2" />
      {data ? (
        <>
          <span
            className="cursor-pointer text-edit absolute right-4 top-2 p-1 hover:bg-gray-200 rounded-lg"
            onClick={onedit}
          >
            <MdEdit size={18} />
          </span>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex gap-2">
              <p className="font-bold">Designation : </p>
              <span className="capitalize">{data?.designationData?.name}</span>
            </div>
            <span
              className="text-xs capitalize line-clamp-6 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: data?.customSummary as string,
              }}
            />
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
