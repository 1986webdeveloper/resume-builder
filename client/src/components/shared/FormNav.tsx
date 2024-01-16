import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface propTypes {
  steps: stepsTypes[];
  onTabChangeFn: any;
}

interface stepsTypes {
  sectionID: string;
  slug: string;
  order: number;
}

export default function FormNav({ steps, onTabChangeFn }: propTypes) {
  const activeTab = useSelector((state: RootState) => state.currentStep);
  const formData: any = useSelector((state: RootState) => state.formData);
  return (
    <ol className="flex items-center justify-center w-fit p-3 space-x-2 text-sm font-medium text-center cursor-pointer mx-auto text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse transition-all duration-700 ease-in-out">
      {steps.map((step, index) => (
        <li
          key={index}
          className={`flex items-center ${
            activeTab.slug === step.slug
              ? "text-cyan-600 dark:text-cyan-500"
              : formData[step.slug]?.data
              ? "text-green-500"
              : ""
          } `}
          onClick={() => onTabChangeFn(step)}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
              activeTab.slug === step.slug
                ? "border-cyan-700 dark:border-cyan-500"
                : ""
            }  rounded-full shrink-0`}
          >
            {index + 1}
          </span>
          <span className="hidden sm:inline-flex sm:ms-2 capitalize">
            {step.slug}
          </span>
          {index !== steps.length - 1 && (
            <span className=" ml-2">
              <MdKeyboardDoubleArrowRight size={20} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
