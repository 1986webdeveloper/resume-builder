import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import PersonalCard from "./PersonalCard";
import DesignationCard from "./DesignationCard";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";
import SkillCard from "./SkillCard";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { Button, Modal } from "flowbite-react";
import { useRef, useState } from "react";
import { httpService } from "../../../services/https";
import { toast } from "react-hot-toast";

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
  const currentStep = useSelector((state: RootState) => state.currentStep);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const iframeRef: any = useRef(null);

  const onEdit = (key: string) => {
    const matchedObj = steps.find((step) => step.slug === key);
    dispatch(
      setCurrentStep({
        slug: matchedObj?.slug,
        sectionID: matchedObj?.sectionID,
        title: matchedObj?.title,
      })
    );
  };

  const handlePdfPreview = () => {
    // Access the contentDocument of the iframe
    const iframeDocument = iframeRef?.current?.contentDocument;

    // Set the font size for the HTML content
    if (iframeDocument) {
      iframeDocument.documentElement.style.fontSize = "8px"; // Set your desired font size here
      iframeDocument.documentElement.style.width = "400px";
      iframeDocument.documentElement.style.height = "500px";
    }
  };

  const onPreview = () => {
    httpService
      .get(`resume/resumeInfo?resumeId=${currentStep.resumeId}&preview=true`)
      .then((res: any) => {
        setResumeContent(res?.data?.data?.fileContent);
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response);
      });
  };

  const downloadPdf = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a download link
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = formData.personal?.data[0]?.full_name || "document.pdf";

      // Append the link to the document and trigger a click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleDownload = () => {
    httpService
      .get(`resume/resumeInfo?resumeId=${currentStep.resumeId}&download=true`)
      .then((res: any) => {
        console.log(res);
        downloadPdf(res?.data?.data?.url);
        setOpenModal(false);
        toast.success("Download Successful");
      })
      .catch((err) => toast.error(err.response));
  };
  return (
    <>
      <div className="h-[calc(100vh-300px)] flex flex-col justify-between">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">
          <PersonalCard
            data={formData.personal?.data ? formData.personal.data[0] : null}
            onedit={() => onEdit("personal")}
          />
          <DesignationCard
            data={
              formData.designation?.data ? formData.designation.data[0] : null
            }
            onedit={() => onEdit("designation")}
          />
          <ExperienceCard
            data={formData.experience?.data ? formData.experience.data : null}
            onedit={() => onEdit("experience")}
          />
          <EducationCard
            data={formData.education?.data ? formData.education.data : null}
            onedit={() => onEdit("education")}
          />
          <SkillCard
            data={formData.skills?.data ? formData.skills.data : null}
            onedit={() => onEdit("skills")}
          />
        </div>
        <div className="self-center">
          <Button color="dark" size="md" pill onClick={onPreview}>
            Preview Resume
          </Button>
        </div>
      </div>
      <Modal show={openModal} size="2xl" onClose={() => setOpenModal(false)}>
        <Modal.Body>
          <div className="p-3 mx-auto">
            <iframe
              className=" w-[420px] h-[500px] mx-auto shadow-xl border rounded-lg no-scrollbar "
              ref={iframeRef}
              title="HTML Content"
              srcDoc={resumeContent}
              onLoad={handlePdfPreview}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="dark" size="md" onClick={handleDownload}>
            <a
              href="http://localhost:5000/"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
            Download
          </Button>
          <Button color="light" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
