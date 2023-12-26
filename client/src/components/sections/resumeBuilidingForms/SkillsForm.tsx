import { Button } from "flowbite-react";
import { FaSearch } from "react-icons/fa";
import { httpService } from "../../../services/https";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";

interface skillsTypes {
  _id: string;
  name: string;
}

interface propTypes {
  id: string;
  resumeId: string;
}

export default function SkillsForm({ id, resumeId }: propTypes) {
  const [skills, setSkills] = useState([] as skillsTypes[]);
  const [addedSkills, setAddedSkills] = useState([] as skillsTypes[]);
  const [serachStr, setSearchStr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStepId = useSelector((state: RootState) => state.currentStep.id);

  const getSkills = (query: string = "") => {
    httpService
      .get(`skills/getAllSkills?searchText=${query}`)
      .then((res: any) => {
        if (res.status === 200) {
          setSkills(res.data?.data);
        }
      });
  };

  useEffect(() => {
    getSkills();
  }, []);

  const onAdd = (selectedSkill: skillsTypes) => {
    setSkills((prev) =>
      prev.filter((skill) => {
        return skill._id !== selectedSkill._id;
      })
    );
    setAddedSkills((prev) => [...prev, selectedSkill]);
  };

  const onRemove = (selectedSkill: skillsTypes) => {
    setSkills((prev) => [...prev, selectedSkill]);
    setAddedSkills((prev) =>
      prev.filter((skill) => {
        return skill._id !== selectedSkill._id;
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
      const modified = addedSkills.map((item) => {
        return { skill: item._id };
      });
      const body = {
        resumeId: resumeId,
        step: currentStepId,
        data: modified,
      };

      console.log(modified);
      httpService
        .post(`resume/createUserResume`, body)
        .then((res: any) => {
          if (res.status === 201) {
            dispatch(
              setCurrentStep({
                value: res.data?.data?.currentStep?.slug,
                id: res.data?.data?.currentStep?.sectionID,
              })
            );
            // navigate(`/resume/${res.data?.data?.currentStep?.slug}`, {
            //   state: {
            //     id: res.data?.data?.currentStep?.sectionID,
            //     resumeId: resumeId,
            //   },
            // });
          }
        })
        .catch((err) => toast.error(err?.response));
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
                className="rounded-l-lg bg-gray-50   focus:border-none focus:outline-none"
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
              {skills?.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-gray-200 px-4 py-2 rounded-lg capitalize cursor-pointer"
                  onClick={() => onAdd(skill)}
                >
                  {skill.name}
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
            {addedSkills?.map((skill) => (
              <div
                key={skill._id}
                className="bg-green-100 shadow-md px-4 py-2 rounded-lg flex justify-between items-center"
              >
                <span className="capitalize">{skill.name}</span>
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
