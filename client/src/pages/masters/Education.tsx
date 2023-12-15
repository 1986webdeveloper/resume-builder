import { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import Breadcrumb from "../../components/shared/Breadcrumb";
import EducationCard from "../../components/shared/EducationCard";
import { getAllEducation } from "../../services/masters/education/getAllEducation";
import AddModal from "../../components/sections/AddModal";
import Input from "../../components/shared/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../components/shared/RichTextEditor";
import { addEducation } from "../../services/masters/education/addEducation";
import { toast } from "react-toastify";

interface educationTypes {
  id: string;
  degreeType: string;
  summary: string;
  score: string;
  scoreLabel: string;
}

export default function Education() {
  const [isOpen, setIsOpen] = useState(false);
  const [educations, setEducations] = useState([]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [openedId, setOpenedID] = useState("");
  const [textAreaData, setTextAreaData] = useState("");
  const [activeEducation, setActiveEducation] = useState<educationTypes>({
    id: "",
    summary: "",
    degreeType: "",
    score: "",
    scoreLabel: "",
  });

  type Inputs = {
    degree: string;
    summary: string;
    score: string;
    scoreLabel: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Inputs>();

  const handleOpenAddModal = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const token = localStorage.getItem("token") || "";

  const getEducations = () => {
    getAllEducation(token).then((res) => {
      if (res.status === 200) {
        setEducations(res.data?.data);
        console.log(res);
      }
    });
  };

  useEffect(() => {
    getEducations();
  }, []);

  const handleOpenDeleteModal = () => {
    console.log("open");
  };

  const handleEditModalOpen = () => {
    console.log("open");
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data, textAreaData);
    addEducation(token, {
      degreeType: data.degree,
      summary: textAreaData,
      performance: { label: data.scoreLabel, value: data.score },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success(res.data.message);
          getEducations();
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error(err.response.data?.error);
      });
  };
  return (
    <>
      <Header
        handleOpenAddModal={handleOpenAddModal}
        title="Available Education"
        description="Add or Edit available Education"
      />
      <Breadcrumb />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
        {educations.map((item, index) => (
          <EducationCard
            id={item._id}
            title={item.degreeType}
            handleOpenDeleteModal={handleOpenDeleteModal}
          />
        ))}
      </div>

      {isOpen && (
        <form
          className="mx-auto max-w-xs mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <AddModal
            handleModalClose={handleModalClose}
            modalTitle="Add Education"
          >
            <div>
              <div className="max-w-md">
                <Input
                  register={register}
                  type="text"
                  placeholder="Degree Name"
                  isRequired={true}
                  id="degree"
                  color={errors?.degree ? "border-red-500" : ""}
                  errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                />
                {errors?.degree?.type && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors?.degree?.message}
                  </p>
                )}
              </div>
              <div className="max-w-md">
                <div className="flex gap-3">
                  <div>
                    <Input
                      register={register}
                      type="number"
                      placeholder="Score"
                      isRequired={true}
                      id="score"
                      color={errors?.score ? "border-red-500" : ""}
                      errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                      customClass="mt-3 mb-3"
                    />
                    {errors?.score?.type && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors?.score?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      register={register}
                      type="text"
                      placeholder="Score Label. Ex - CGPA"
                      isRequired={true}
                      id="scoreLabel"
                      color={errors?.scoreLabel ? "border-red-500" : ""}
                      errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                      customClass="mt-3 mb-3"
                    />
                    {errors?.scoreLabel?.type && (
                      <p className="text-red-600 mt-1 text-xs">
                        {errors?.scoreLabel?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="max-w-md">
                <RichTextEditor
                  setTextAreaData={setTextAreaData}
                  // defaultData={activeEducation.summary}
                />
              </div>
            </div>
          </AddModal>
        </form>
      )}
    </>
  );
}
