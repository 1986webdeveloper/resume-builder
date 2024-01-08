import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import PersonalCard from "./PersonalCard";
import DesignationCard from "./DesignationCard";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";
import SkillCard from "./SkillCard";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";

interface stepsTypes {
  sectionID: string;
  slug: string;
  order: number;
  title: string;
}

interface propType {
  steps: Array<stepsTypes>;
}

export default function Preview({ steps }: propType) {
  const formData: any = useSelector((state: RootState) => state.formData);
  const dispatch = useDispatch();
  console.log(formData["personal"]);

  const onEdit = (key: string) => {
    const matchedObj = steps.find((step) => step.slug === key);
    dispatch(
      setCurrentStep({
        slug: matchedObj?.slug,
        sectionID: matchedObj?.sectionID,
        title: matchedObj?.title,
      })
    );
    console.log(matchedObj, "match");
  };
  return (
    <div className="w-full h-full">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full h-full">
        <PersonalCard
          data={formData.personal?.data[0]}
          id={formData.personal?.id}
          onedit={() => onEdit("personal")}
        />
        <DesignationCard
          data={formData?.designation?.data[0]}
          id={formData.designation?.id}
          onedit={() => onEdit("designation")}
        />
        <ExperienceCard
          data={formData?.experience?.data}
          id={formData?.experience?.id}
          onedit={() => onEdit("experience")}
        />
        <EducationCard
          data={formData?.education?.data}
          id={formData?.education?.id}
          onedit={() => onEdit("education")}
        />
        <SkillCard
          skills={formData.skills?.data}
          id={formData.skills?.id}
          onedit={() => onEdit("skills")}
        />
      </div>
    </div>
  );
}
