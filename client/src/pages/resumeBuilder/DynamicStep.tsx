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

  function sortByOrder(arr: stepsTypes[]) {
    const sortedArray = arr.slice().sort((a, b) => a.order - b.order);
    return sortedArray;
  }

  const getSteps = () => {
    httpService.get("resume/stepInfo").then((res: any) => {
      setSteps(sortByOrder(res.data?.data));
    });
  };

  useEffect(() => {
    getSteps();
  }, []);

  const onTabChangeFn = (step: stepsTypes) => {
    dispatch(setCurrentStep({ ...step }));
  };

  return (
    <div>
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center capitalize">
          {currentStep?.title}
        </h1>
      </div>
      <div className="mt-5 w-full">
        <FormNav steps={steps} onTabChangeFn={onTabChangeFn} />
      </div>
      {steps && (
        <div className="mt-5">
          {currentStep.slug === "personal" && <PersonalForm id={sectionId} />}
          {currentStep.slug === "designation" && <DesignationForm />}
          {currentStep.slug === "experience" && <ExperienceForm />}
          {currentStep.slug === "education" && <EducationForm />}
          {currentStep.slug === "skills" && <SkillsForm />}
          {currentStep.slug === "preview" && <Preview steps={steps} />}
        </div>
      )}
    </div>
  );
}
