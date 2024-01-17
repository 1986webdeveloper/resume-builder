import { BsDatabaseExclamation } from "react-icons/bs";

interface propTypes {
  description: string;
}

export default function EmptyState({ description }: propTypes) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-2 items-center">
        <BsDatabaseExclamation color="gray" size={60} />
        <p className="text-sm text-center ml-2 text-gray-400">{description}</p>
      </div>
    </div>
  );
}
