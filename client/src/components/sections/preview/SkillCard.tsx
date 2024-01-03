import { MdEdit } from "react-icons/md";

interface propTypes {
  skills: Array<string>;
  id: string;
  onedit: () => void;
}

export default function SkillCard({ skills, id, onedit }: propTypes) {
  return (
    <div className="relative px-4 py-3  shadow-xl rounded-lg border text-sm">
      <h1 className="font-bold text-lg text-center">Skills</h1>
      <span
        className="cursor-pointer text-edit absolute right-2 top-2"
        onClick={onedit}
      >
        <MdEdit size={18} />
      </span>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-2 mt-5 max-h-[200px] overflow-auto">
        {skills?.map((skill) => (
          <div className="px-2 py-2 bg-gray-300 rounded-lg">
            <span className="capitalize">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
