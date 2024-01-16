import { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import EducationCard from "../../components/shared/EducationCard";
import AddModal from "../../components/sections/AddModal";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../components/shared/RichTextEditor";
import { toast } from "react-hot-toast";
import { httpService } from "../../services/https";
import Modal from "../../components/sections/DeleteModal";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import EmptyState from "../../components/shared/EmptyState";
import CustomInput from "../../components/shared/CustomInput";

interface educationTypes {
  _id: string;
  degreeType: string;
  summary: string;
  score: string;
  scoreLabel: string;
}

export default function Education() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [openedId, setOpenedId] = useState("");
  const [educations, setEducations] = useState([]);
  const [textAreaData, setTextAreaData] = useState("");
  const [activeEducation, setActiveEducation] = useState<educationTypes>({
    _id: "",
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

  const getEducations = () => {
    httpService.get(`education/getAllEducationDetails`).then((res: any) => {
      if (res.statusText === "OK") {
        setEducations(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getEducations();
  }, []);

  const openModal = (id: string, type: string = "add") => {
    setModalType(type);
    setOpenedId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onAdd: SubmitHandler<Inputs> = (data) => {
    const body = {
      degreeType: data.degree,
      summary: textAreaData,
      performance: { label: data.scoreLabel, value: data.score },
    };
    httpService
      .post(`education/addEducation`, body)
      .then((res: any) => {
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

  const onDelete = () => {
    httpService
      .post(`education/editOrDeleteEducation`, {
        educationId: openedId,
        active: false,
      })
      .then((res: any) => {
        if (res.status === 200) {
          toast.success(res.data?.message);
          getEducations();
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };
  return (
    <>
      <Header
        handleOpenAddModal={openModal}
        title="Available Education"
        description="Add or Edit available Education"
      />
      <CustomBreadcrumb />
      <div>
        {educations.length >= 1 ? (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
            {educations.map((item: educationTypes, index) => (
              <EducationCard
                key={index}
                id={item._id}
                title={item?.degreeType}
                handleOpenDeleteModal={openModal}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="No Educations to show." />
        )}
      </div>

      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onAdd)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Education">
            <div className="flex flex-col gap-3">
              <CustomInput
                type="text"
                isRequired={true}
                id="degree"
                placeholder="Degree Name"
                register={register}
                errors={errors}
                errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              />
              <div className="max-w-md">
                <div className="flex gap-3">
                  <CustomInput
                    type="number"
                    isRequired={true}
                    id="score"
                    placeholder="Score"
                    register={register}
                    errors={errors}
                    errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                  />
                  <CustomInput
                    type="text"
                    isRequired={true}
                    id="scoreLabel"
                    placeholder="Score Label. Ex - CGPA"
                    register={register}
                    errors={errors}
                    errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                  />
                </div>
              </div>
              <div className="max-w-md">
                <RichTextEditor setTextAreaData={setTextAreaData} />
              </div>
            </div>
          </AddModal>
        </form>
      )}

      {isOpen && modalType === "delete" && (
        <Modal handleDeleteModalClose={closeModal} handleDelete={onDelete} />
      )}
    </>
  );
}
