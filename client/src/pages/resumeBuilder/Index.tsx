import { useNavigate } from "react-router-dom";
import ResumeCard from "../../components/shared/ResumeCard";
import { httpService } from "../../services/https";
import { useEffect, useState } from "react";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import { Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  clearSteps,
  setCurrentStep,
} from "../../store/slices/currentStepSlice";
import { BsDatabaseExclamation } from "react-icons/bs";
import Modal from "../../components/sections/DeleteModal";
import { clearFormData, setFormData } from "../../store/slices/formDataSlice";

interface resumeType {
  full_name: string;
  email: string;
  mobileNo: string;
  designations: designationsTypes[];
  summary: string;
  _id: string;
}

interface designationsTypes {
  _id: string;
  name: string;
  summaries: string;
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [allResume, setAllResume] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openedId, setOpenedId] = useState("");
  const dispatch = useDispatch();

  const newResume = () => {
    dispatch(clearSteps());
    dispatch(clearFormData());
    localStorage.removeItem("resumeId");
    navigate("build");
  };

  const getResumeList = () => {
    httpService.get("resume/resumeList").then((res: any) => {
      if (res.status === 200) {
        setAllResume(res.data?.data);
      }
    });
  };

  const onContinue = (id: string) => {
    localStorage.setItem("resumeId", id);
    navigate(`build`);
  };

  const onDelete = (id: string) => {
    const body = {
      resumeId: id,
      active: false,
    };
    httpService
      .post(`resume/editOrDeleteUserResume`, body)
      .then((res: any) => {
        if (res.status === 200) {
          toast.success(res.data?.message);
          setIsOpen(false);
          getResumeList();
        }
      })
      .catch((err) => toast.error(err.response));
  };

  const onModalOpen = (id: string) => {
    setIsOpen(true);
    setOpenedId(id);
  };

  useEffect(() => {
    getResumeList();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full mt-3 relative">
        <h1 className="font-bold text-3xl text-center dark:text-gray-100">
          Resume List
        </h1>
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
                designation={resume?.designations[0]?.name || "To be decide"}
                summary={resume.designations[0]?.summaries || "To be decide..."}
                onContinue={() => onContinue(resume._id)}
                onDelete={() => onModalOpen(resume._id)}
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
      {isOpen && (
        <Modal
          handleDeleteModalClose={() => setIsOpen(false)}
          handleDelete={() => onDelete(openedId)}
        />
      )}
    </div>
  );
}
