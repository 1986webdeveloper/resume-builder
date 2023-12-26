import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/shared/Breadcrumb";
import Header from "../../components/shared/Header";
import ResumeCard from "../../components/shared/ResumeCard";
import { httpService } from "../../services/https";
import { useEffect, useState } from "react";

interface resumeType {
  full_name: string;
  email: string;
  mobileNo: string;
  designation: string;
  summary: string;
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const [allResume, setAllResume] = useState([]);
  const newResume = () => {
    return navigate("personal");
  };

  const getResumeList = () => {
    httpService.get("resume/resumeList").then((res: any) => {
      if (res.status === 200) {
        console.log(res);
        setAllResume(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getResumeList();
  }, []);

  return (
    <>
      <Header
        title="Build Your Resume"
        description="Add/Edit your resume."
        handleOpenAddModal={newResume}
      />
      <Breadcrumb />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grikd-cols-1 gap-6 mt-16">
        {allResume.map((resume: resumeType) => (
          <ResumeCard
            title={resume.full_name}
            email={resume.email}
            phone={resume.mobileNo}
            designation="FrontEnd Developer"
            summary="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate beatae veniam perferendis unde. Consequatur, neque ullam assumenda voluptatum nesciunt nemo architecto vel aspernatur nobis modi atque ad sequi cupiditate possimus!"
          />
        ))}
      </div>
    </>
  );
}
