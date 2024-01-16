import { MdEdit } from "react-icons/md";
import PreviewCard from "../../shared/PreviewCard";
import Badge from "../../shared/Badge";
import { BsDatabaseExclamation } from "react-icons/bs";

interface propTypes {
  data: Array<string>;
  onedit: () => void;
}

export default function SkillCard({ data, onedit }: propTypes) {
  return (
    <PreviewCard>
      <h1 className="font-bold text-lg text-center font-mono">Skills</h1>
      <hr className="mt-2" />
      {data ? (
        <>
          <span
            className="cursor-pointer text-edit absolute right-4 top-2 p-1 hover:bg-gray-200 rounded-lg"
            onClick={onedit}
          >
            <MdEdit size={18} />
          </span>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 mt-5 max-h-[200px] overflow-auto ">
            {data?.map((skill) => (
              <Badge name={skill} />
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
