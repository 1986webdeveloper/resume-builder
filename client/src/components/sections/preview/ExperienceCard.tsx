import { MdEdit } from "react-icons/md";
import { experienceFormTypes } from "../../../types/formTypes";
import PreviewCard from "../../shared/PreviewCard";
import { BsDatabaseExclamation } from "react-icons/bs";

interface extendedTypes extends experienceFormTypes {
  experienceData: any;
  customSummary: string;
}

interface propType {
  data: Array<extendedTypes>;
  onedit: () => void;
}

export default function ExperienceCard({ data, onedit }: propType) {
  return (
    <PreviewCard>
      <h1 className="font-bold text-lg text-center font-mono">Experience</h1>
      <hr className="mt-2" />
      {data ? (
        <>
          <span
            className="cursor-pointer text-edit absolute right-4 top-2 p-1 hover:bg-gray-200 rounded-lg"
            onClick={onedit}
          >
            <MdEdit size={18} />
          </span>
          <div className="flex flex-col gap-2 mt-4 max-h-[200px] overflow-auto ">
            {data?.map((ele, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 shadow-lg border rounded-lg px-2 py-3"
              >
                <div className="flex gap-2">
                  <p className="font-bold">Company : </p>
                  <span className="capitalize">{ele.companyName}</span>
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
                  <p className="font-bold">Designation : </p>
                  <span className="capitalize">{ele.experienceData?.name}</span>
                </div>
                <span
                  className="text-xs capitalize line-clamp-3 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: ele.customSummary as string,
                  }}
                />
              </div>
            ))}
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
