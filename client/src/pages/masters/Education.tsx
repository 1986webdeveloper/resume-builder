import { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import Breadcrumb from "../../components/shared/Breadcrumb";
import EducationCard from "../../components/shared/EducationCard";
import AddModal from "../../components/sections/AddModal";
import Input from "../../components/shared/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../components/shared/RichTextEditor";
import { toast } from "react-toastify";
import { httpService } from "../../services/https";
import Modal from "../../components/sections/DeleteModal";

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
    console.log(data, textAreaData);
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
      <Breadcrumb />
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

      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onAdd)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Education">
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
