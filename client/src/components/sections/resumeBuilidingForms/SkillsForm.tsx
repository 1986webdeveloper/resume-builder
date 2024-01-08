import { Button } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { httpService } from "../../../services/https";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { getDesiredDataFromPreview } from "../../../services/helper";
import { updateFormData } from "../../../store/slices/formDataSlice";

export default function SkillsForm() {
  const formData: any = useSelector(
    (state: RootState) => state.formData.skills
  );
  const currentStep = useSelector((state: RootState) => state.currentStep);
  const [skills, setSkills] = useState([] as string[]);
  const [addedSkills, setAddedSkills] = useState(formData?.data || []);
  const [serachStr, setSearchStr] = useState("");
  const dispatch = useDispatch();

  const getSkills = (query: string = "") => {
    httpService
      .get(`skills/getAllSkills?searchText=${query}`)
      .then((res: any) => {
        if (res.status === 200) {
          const modified = res.data?.data.map((data: any) => {
            return `${data.name}`;
          });
          setSkills(modified);
        }
      });
  };

  useEffect(() => {
    getSkills();
  }, []);

  const onAdd = (selectedSkill: string) => {
    setSkills((prev) =>
      prev.filter((skill) => {
        return skill !== selectedSkill;
      })
    );
    setAddedSkills((prev: string[]) => [...prev, selectedSkill]);
  };

  const onRemove = (selectedSkill: string) => {
    setSkills((prev) => [...prev, selectedSkill]);
    setAddedSkills((prev: string[]) =>
      prev.filter((skill) => {
        return skill !== selectedSkill;
      })
    );
  };

  const onSearch = (str: string) => {
    setSearchStr(str);
  };

  const onSearchSubmit = () => {
    getSkills(serachStr);
  };

  const onContinue = () => {
    if (addedSkills.length >= 1) {
      if (formData?.data) {
        const body = {
          resumeId: currentStep.resumeId,
          sectionId: formData?._id,
          active: true,
          data: {
            skills: addedSkills,
          },
        };
        httpService
          .post(`resume/editOrDeleteUserResume`, body)
          .then((res: any) => {
            toast.success(res?.data?.message);
            const previewData = getDesiredDataFromPreview(
              res.data?.data?.steps,
              currentStep.sectionID
            );
            dispatch(
              updateFormData({
                key: "skills",
                value: previewData,
              })
            );
          })
          .catch((err) => {
            toast.error(err?.error);
          });
      } else {
        const body = {
          resumeId: currentStep.resumeId,
          step: currentStep.sectionID,
          data: { skill: addedSkills },
        };

        httpService
          .post(`resume/createUserResume`, body)
          .then((res: any) => {
            if (res.status === 201) {
              const previewData = getDesiredDataFromPreview(
                res.data?.data?.previewData?.steps,
                currentStep.sectionID
              );
              dispatch(
                updateFormData({
                  key: "skills",
                  value: previewData,
                })
              );
              dispatch(
                setCurrentStep({
                  slug: res.data?.data?.currentStep?.slug,
                  sectionID: res.data?.data?.currentStep?.sectionID,
                  title: res.data?.data?.currentStep?.title,
                })
              );
            }
          })
          .catch((err) => toast.error(err?.response));
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-10 w-full">
        <div className="min-w-[20%] max-w-[20%] min-h-[500px] max-h-[500px]"></div>
        <div className="min-w-[50%] max-w-[50%] min-h-[500px] max-h-[500px]  overflow-y-auto shadow-xl border px-4 py-8 rounded-lg flex flex-col gap-6">
          <div className="w-full flex justify-center items-center">
            <div className="flex shadow-lg">
              <input
                className="rounded-l-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border focus:border-none"
                type="text"
                value={serachStr}
                onChange={(e) => onSearch(e.target.value)}
              />
              <Button
                className="rounded-none rounded-r-lg"
                onClick={onSearchSubmit}
              >
                <FaSearch />
              </Button>
            </div>
          </div>
          <div>
            <div className="w-full h-full min-h-full grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-3">
              {skills?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg capitalize cursor-pointer"
                  onClick={() => onAdd(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto self-center">
            <Button color="success" className="px-9" onClick={onContinue}>
              Continue
            </Button>
          </div>
        </div>
        <div className="min-w-[20%] max-w-[20%] min-h-[500px] max-h-[500px] px-4 py-2 overflow-y-auto rounded-lg">
          <div className="w-full h-full grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-3">
            {addedSkills?.map((skill: string, index: number) => (
              <div
                key={index}
                className="bg-green-100 dark:bg-green-800 dark:text-gray-100 shadow-md px-4 py-2 rounded-lg flex justify-between items-center"
              >
                <span className="capitalize">{skill}</span>
                <span
                  className="p-1 cursor-pointer"
                  onClick={() => onRemove(skill)}
                >
                  <FaTrash size={12} color="red" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
