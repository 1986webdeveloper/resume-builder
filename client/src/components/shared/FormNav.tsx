import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface propTypes {
  steps: stepTypes[];
  onTabChangeFn: any;
}

interface stepTypes {
  name: string;
}

export default function FormNav({ steps, onTabChangeFn }: propTypes) {
  const activeTab = useSelector((state: RootState) => state.currentStep.value);

  return (
    <ol className="flex items-center justify-center w-fit p-3 space-x-2 text-sm font-medium text-center cursor-pointer mx-auto text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
      {steps.map((step, index) => (
        <li
          className={`flex items-center ${
            activeTab === step.name ? "text-cyan-600 dark:text-cyan-500" : ""
          } `}
          onClick={() => onTabChangeFn(step.name)}
        >
          <span
            className={`flex items-center justify-center w-5 h-5 me-2 text-xs border ${
              activeTab === step.name
                ? "border-cyan-700 dark:border-cyan-500"
                : ""
            }  rounded-full shrink-0`}
          >
            {index + 1}
          </span>
          <span className="hidden sm:inline-flex sm:ms-2 capitalize">
            {step.name}
          </span>
          {index !== steps.length - 1 && (
            <span className=" ml-2">
              <MdKeyboardDoubleArrowRight size={20} />
            </span>
          )}
        </li>
      ))}
      {/* <li className="flex items-center text-blue-600 dark:text-blue-500">
        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
          1
        </span>
        Personal <span className="hidden sm:inline-flex sm:ms-2">Info</span>
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className="flex items-center">
        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
          2
        </span>
        Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
        <svg
          className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 12 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m7 9 4-4-4-4M1 9l4-4-4-4"
          />
        </svg>
      </li>
      <li className="flex items-center">
        <span className="flex items-center justify-center w-5 h-5 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
          3
        </span>
        Review
      </li> */}
    </ol>
  );
}
