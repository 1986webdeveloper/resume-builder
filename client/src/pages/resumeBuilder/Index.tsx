import { useNavigate } from "react-router-dom";
import ResumeCard from "../../components/shared/ResumeCard";
import { httpService } from "../../services/https";
import { useEffect, useState } from "react";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../store/slices/currentStepSlice";

interface resumeType {
  full_name: string;
  email: string;
  mobileNo: string;
  designation: string;
  summary: string;
  _id: string;
}

interface newResumeType {
  _id: string;
  title: string;
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [allResume, setAllResume] = useState([]);
  const [newResumeInfo, setNewResumeInfo] = useState({} as newResumeType);
  const dispatch = useDispatch();
  const newResume = () => {
    httpService
      .get(`resume/resumeInfo`)
      .then((res: any) => {
        setNewResumeInfo({
          _id: res.data?.data?.currentStep?._id,
          title: res.data?.data?.currentStep?.title,
        });
        dispatch(
          setCurrentStep({
            value: res.data?.data?.currentStep?.slug,
            id: res.data?.data?.currentStep?.sectionID,
          })
        );
        localStorage.removeItem("currentStep");
        return navigate("personal", {
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
        console.log(res);
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
          navigate(`${res.data?.data?.currentStep?.slug}`, {
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
    <div className="w-full">
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center">Resume List</h1>
        <Button className="absolute top-0 right-0" onClick={newResume}>
          New Resume
        </Button>
      </div>
      <div className="mt-2">
        <CustomBreadcrumb />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-5">
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
    </div>
  );
}
