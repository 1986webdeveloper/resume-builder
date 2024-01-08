import { MdEdit } from "react-icons/md";
import { educationFormTypes } from "../../../types/formTypes";

interface performanceTypes {
  value: string;
  label: string;
}

interface extendedType extends educationFormTypes {
  customPerformance: performanceTypes;
  customSummary: string;
}

interface propType {
  data: Array<extendedType>;
  id: string;
  onedit: () => void;
}

export default function EducationCard({ data, id, onedit }: propType) {
  return (
    <div className="relative px-4 py-3  shadow-xl rounded-lg border text-sm">
      <h1 className="font-bold text-lg text-center">Education</h1>
      <span
        className="cursor-pointer text-edit absolute right-2 top-2"
        onClick={onedit}
      >
        <MdEdit size={18} />
      </span>
      <div className="flex flex-col gap-2 mt-4 max-h-[200px] overflow-auto">
        {data?.map((ele) => (
          <div className="flex flex-col gap-2 shadow-lg border rounded-lg px-2 py-3">
            <div className="flex gap-2">
              <p className="font-bold">Education : </p>
              <span className="capitalize">Bachelors</span>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Performance : </p>
              <span className="capitalize">
                {ele?.customPerformance?.value} {ele?.customPerformance?.label}
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
              className="text-xs capitalize line-clamp-6 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: ele?.customSummary as string }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
