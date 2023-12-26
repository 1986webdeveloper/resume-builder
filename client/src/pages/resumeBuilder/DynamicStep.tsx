import { useParams } from "react-router-dom";
import Header from "../../components/shared/Header";
import { useEffect, useState } from "react";
import PersonalForm from "../../components/sections/resumeBuilidingForms/PersonalForm";
import DesignationForm from "../../components/sections/resumeBuilidingForms/DesignationForm";
import ExperienceForm from "../../components/sections/resumeBuilidingForms/ExperienceForm";

export default function DynamicStep() {
  const { step } = useParams();
  const [currentStep, setCurrentStep] = useState(step);

  useEffect(() => {
    setCurrentStep(step);
  }, [step]);

  return (
    <div>
      <Header
        title="Fill Your Information"
        description={`Step - ${step?.toUpperCase()}`}
        btnNeeded={false}
      />
      {currentStep === "personal" && <PersonalForm />}
      {currentStep === "designation" && <DesignationForm />}
      {currentStep === "experience" && <ExperienceForm />}
    </div>
  );
}
