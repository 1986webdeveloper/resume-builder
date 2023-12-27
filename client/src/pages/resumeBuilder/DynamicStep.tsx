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

export default function DynamicStep() {
  const location = useLocation();
  const sectionId = location.state?.id;
  const resumeId = location.state?.resumeId;
  const dispatch = useDispatch();
  const currentStep = useSelector(
    (state: RootState) => state.currentStep.value
  );
  const steps = [
    {
      name: "personal",
    },
    {
      name: "designation",
    },
    {
      name: "experience",
    },
    {
      name: "education",
    },
    {
      name: "skills",
    },
    {
      name: "preview",
    },
  ];

  const onTabChangeFn = (step: string) => {
    dispatch(setCurrentStep({ value: step }));
  };

  return (
    <div>
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center">Current Step {}</h1>
      </div>
      <div className="mt-5 w-full">
        <FormNav steps={steps} onTabChangeFn={onTabChangeFn} />
      </div>
      <div className="mt-5">
        {currentStep === "personal" && <PersonalForm id={sectionId} />}
        {currentStep === "designation" && (
          <DesignationForm resumeId={resumeId} />
        )}
        {currentStep === "experience" && <ExperienceForm resumeId={resumeId} />}
        {currentStep === "education" && <EducationForm resumeId={resumeId} />}
        {currentStep === "skills" && <SkillsForm resumeId={resumeId} />}
      </div>
    </div>
  );
}
