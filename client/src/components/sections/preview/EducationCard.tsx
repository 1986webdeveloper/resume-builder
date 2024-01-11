import { MdEdit } from "react-icons/md";
import { educationFormTypes } from "../../../types/formTypes";
import PreviewCard from "../../shared/PreviewCard";
import { BsDatabaseExclamation } from "react-icons/bs";

interface performanceTypes {
  value: string;
  label: string;
}

interface degreeTypes {
  degreeType: string;
}

interface extendedType extends educationFormTypes {
  customPerformance: performanceTypes;
  customSummary: string;
  educationData: degreeTypes;
}

interface propType {
  data: Array<extendedType>;
  onedit: () => void;
}

export default function EducationCard({ data, onedit }: propType) {
  return (
    <PreviewCard>
      <h1 className="font-bold text-lg text-center font-mono">Education</h1>
      <hr className="mt-2" />
      {data ? (
        <div>
          <span
            className="cursor-pointer text-edit absolute right-4 top-2 p-1 hover:bg-gray-200 rounded-lg"
            onClick={onedit}
          >
            <MdEdit size={18} />
          </span>
          <div className="flex flex-col gap-2 mt-4 max-h-[200px] overflow-auto">
            {data?.map((ele) => (
              <div className="flex flex-col gap-2 shadow-lg border rounded-lg px-2 py-3">
                <div className="flex gap-2">
                  <p className="font-bold">Education : </p>
                  <span className="capitalize">
                    {ele?.educationData?.degreeType}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="font-bold">Performance : </p>
                  <span className="capitalize">
                    {ele?.customPerformance?.value}{" "}
                    {ele?.customPerformance?.label}
                  </span>
                </div>
                <div className="flex gap-3">
                  <div className="flex gap-2">
                    <p className="font-bold">From : </p>
                    <span className="capitalize">{ele.from}</span>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-bold">To : </p>
                    <span className="capitalize">
                      {ele.present ? "Present" : ele?.to}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <p className="font-bold">Institute : </p>
                  <span className="capitalize">{ele?.instituteName}</span>
                </div>
                <span
                  className="text-xs capitalize line-clamp-3 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: ele?.customSummary as string,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
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
