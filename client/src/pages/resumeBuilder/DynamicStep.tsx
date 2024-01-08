import { useLocation } from "react-router-dom";
import PersonalForm from "../../components/sections/resumeBuilidingForms/PersonalForm";
import DesignationForm from "../../components/sections/resumeBuilidingForms/DesignationForm";
import ExperienceForm from "../../components/sections/resumeBuilidingForms/ExperienceForm";
import EducationForm from "../../components/sections/resumeBuilidingForms/EducationForm";
import SkillsForm from "../../components/sections/resumeBuilidingForms/SkillsForm";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { setCurrentStep } from "../../store/slices/currentStepSlice";
import FormNav from "../../components/shared/FormNav";
import { httpService } from "../../services/https";
import { useEffect, useState } from "react";
import Preview from "../../components/sections/preview/Preview";
import { setFormData } from "../../store/slices/formDataSlice";
import { toast } from "react-hot-toast";
import { BsDatabaseExclamation } from "react-icons/bs";

interface stepsTypes {
  sectionID: string;
  slug: string;
  order: number;
  title: string;
}

export default function DynamicStep() {
  const location = useLocation();
  const sectionId = location.state?.id;
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.currentStep);
  const [steps, setSteps] = useState([] as stepsTypes[]);
  const [isLoading, setIsLoading] = useState(false);
  const resumeId = localStorage.getItem("resumeId") || "";

  function sortByOrder(arr: stepsTypes[]) {
    const sortedArray = arr.slice().sort((a, b) => a.order - b.order);
    return sortedArray;
  }

  const getSteps = () => {
    httpService.get("resume/stepInfo").then((res: any) => {
      setIsLoading(false);
      setSteps(sortByOrder(res.data?.data));
    });
  };

  const getResumeInfo = () => {
    setIsLoading(true);
    httpService
      .get(`resume/resumeInfo?resumeId=${resumeId}`)
      .then((res: any) => {
        dispatch(
          setCurrentStep({
            slug: res.data?.data?.currentStep?.slug,
            sectionID: res.data?.data?.currentStep?.sectionID,
            title: res.data?.data?.currentStep?.title,
            resumeId: resumeId,
          })
        );
        if (res.data?.data?.previewData) {
          // Dispatch the action of setting the filled steps's data into global state.
          let previewArr = res.data?.data?.previewData?.steps?.map(
            (preview: any) => {
              return {
                key: preview.slug,
                value: { _id: preview._id, data: preview.data },
              };
            }
          );
          dispatch(setFormData(previewArr));
        }
        getSteps();
      })
      .catch((err) => {
        toast.error(err.response);
        console.log("ERROR ", err);
      });
  };

  useEffect(() => {
    getResumeInfo();
  }, []);

  const onTabChangeFn = (step: stepsTypes) => {
    dispatch(setCurrentStep({ ...step }));
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full min-h-[650px] flex justify-center items-center">
          <div className="flex flex-col gap-2 items-center justify-center">
            <BsDatabaseExclamation color="gray" size={60} />
            <p className="text-sm text-center ml-2 text-gray-400">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full mt-3 relative">
            <h1 className="font-bold text-3xl text-center capitalize dark:text-gray-100">
              {currentStep?.title}
            </h1>
          </div>
          <div className="mt-5 w-full">
            <FormNav steps={steps} onTabChangeFn={onTabChangeFn} />
          </div>
          {steps && (
            <div className="mt-5">
              {currentStep.slug === "personal" && (
                <PersonalForm id={sectionId} />
              )}
              {currentStep.slug === "designation" && <DesignationForm />}
              {currentStep.slug === "experience" && <ExperienceForm />}
              {currentStep.slug === "education" && <EducationForm />}
              {currentStep.slug === "skills" && <SkillsForm />}
              {currentStep.slug === "preview" && <Preview steps={steps} />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
