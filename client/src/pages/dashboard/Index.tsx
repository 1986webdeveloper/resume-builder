import { BsDatabaseExclamation } from "react-icons/bs";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-2 items-center justify-center">
        <BsDatabaseExclamation color="gray" size={60} />
        <p className="text-sm text-center ml-2 text-gray-400">
          Development In Progress
        </p>
      </div>
    </div>
  );
}
