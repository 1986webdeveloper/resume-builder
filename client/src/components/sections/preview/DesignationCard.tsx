import { MdEdit } from "react-icons/md";
import { designationFormTypes } from "../../../types/formTypes";

interface extendedTypes extends designationFormTypes {
  designationData: any;
  customSummary: string;
}

interface propType {
  data: extendedTypes;
  id: string;
  onedit: () => void;
}

export default function DesignationCard({ data, id, onedit }: propType) {
  return (
    <div className="relative px-4 py-3  shadow-xl rounded-lg border text-sm">
      <h1 className="font-bold text-lg text-center">Designation</h1>
      <span
        className="cursor-pointer text-edit absolute right-2 top-2"
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
          dangerouslySetInnerHTML={{ __html: data?.customSummary as string }}
        />
      </div>
    </div>
  );
}
