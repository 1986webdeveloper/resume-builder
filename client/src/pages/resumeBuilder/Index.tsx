import { useNavigate } from "react-router-dom";
import ResumeCard from "../../components/shared/ResumeCard";
import { httpService } from "../../services/https";
import { useEffect, useState } from "react";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCurrentStep } from "../../store/slices/currentStepSlice";
import { BsDatabaseExclamation } from "react-icons/bs";

interface resumeType {
  full_name: string;
  email: string;
  mobileNo: string;
  designation: string;
  summary: string;
  _id: string;
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [allResume, setAllResume] = useState([]);
  const dispatch = useDispatch();
  const newResume = () => {
    httpService
      .get(`resume/resumeInfo`)
      .then((res: any) => {
        dispatch(
          setCurrentStep({
            value: res.data?.data?.currentStep?.slug,
            id: res.data?.data?.currentStep?.sectionID,
          })
        );
        localStorage.removeItem("currentStep");
        return navigate("build", {
          state: {
            id: res.data?.data?.currentStep?.sectionID,
            resumeId: res.data?.data?.currentStep?._id,
          },
        });
      })
      .catch((err) => toast.error(err?.response));
  };

  const getResumeList = () => {
    httpService.get("resume/resumeList").then((res: any) => {
      if (res.status === 200) {
        setAllResume(res.data?.data);
      }
    });
  };

  const onContinue = (id: string) => {
    httpService
      .get(`resume/resumeInfo?resumeId=${id}`)
      .then((res: any) => {
        if (res.status === 200) {
          localStorage.setItem(
            "currentStep",
            res.data?.data?.currentStep?.slug
          );
          dispatch(
            setCurrentStep({
              value: res.data?.data?.currentStep?.slug,
              id: res.data?.data?.currentStep?.sectionID,
            })
          );
          navigate(`build`, {
            state: { id: res.data?.data?.currentStep?.sectionID, resumeId: id },
          });
        }
      })
      .catch((err) => toast.error(err.response));
  };

  useEffect(() => {
    getResumeList();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center">Resume List</h1>
        <Button
          color="dark"
          pill
          className="absolute top-0 right-0"
          onClick={newResume}
        >
          New Resume
        </Button>
      </div>
      <div className="mt-2">
        <CustomBreadcrumb />
      </div>
      <div className="w-full h-full">
        {allResume.length >= 1 ? (
          <div className="grid lg:grid-cols-5 md:grid-cols-4 grikd-cols-3 gap-6 mt-5">
            {allResume.map((resume: resumeType) => (
              <ResumeCard
                title={resume.full_name}
                email={resume.email}
                phone={resume.mobileNo}
                designation="FrontEnd Developer"
                summary="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate beatae veniam perferendis unde. Consequatur, neque ullam assumenda voluptatum nesciunt nemo architecto vel aspernatur nobis modi atque ad sequi cupiditate possimus!"
                onContinue={() => onContinue(resume._id)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full min-h-[650px] flex justify-center items-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              <BsDatabaseExclamation color="gray" size={60} />
              <p className="text-sm text-center ml-2 text-gray-400">
                No Resumes to show.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
