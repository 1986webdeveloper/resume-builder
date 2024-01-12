import SummaryCard from "../../components/shared/SummaryCard";
import { useEffect, useState } from "react";
import AddModal from "../../components/sections/AddModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Modal from "../../components/sections/DeleteModal";
import Header from "../../components/shared/Header";
import { httpService } from "../../services/https";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import EmptyState from "../../components/shared/EmptyState";
import CustomInput from "../../components/shared/CustomInput";

interface skillTypes {
  name: string;
  _id: string;
}

export default function Skills() {
  const [allSkills, setAllSkills] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeSkill, setActiveSkill] = useState({ id: "", skill: "" });

  type Inputs = {
    skill: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Inputs>();

  const getAllSkills = () => {
    httpService.get(`skills/getAllSkills`).then((res: any) => {
      if (res.status === 200) {
        setAllSkills(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getAllSkills();
  }, []);

  const openModal = (
    id: string = "",
    skill: string = "",
    type: string = "add"
  ) => {
    setModalType(type);
    setActiveSkill({ id: id, skill: skill });
    if (type === "edit") setValue("skill", skill);
    setIsOpen(true);
  };

  const onAdd: SubmitHandler<Inputs> = (data) => {
    httpService
      .post(`skills/addSkills`, { name: data.skill })
      .then((res: any) => {
        if (res.status === 201) {
          getAllSkills();
          toast.success(res.data?.message);
          setIsOpen(false);
          reset();
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const onEdit = (data: any) => {
    const body = {
      skillId: activeSkill.id,
      name: data.skill,
    };
    httpService
      .post("skills/editOrDelete", body)
      .then((res: any) => {
        if (res.status === 200) {
          getAllSkills();
          toast.success(res.data?.message);
          setIsOpen(false);
          reset();
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const onDelete = () => {
    httpService
      .post("skills/editOrDelete", { skillId: activeSkill.id, active: false })
      .then((res: any) => {
        if (res.status === 200) {
          toast.error(res.data?.message);
          setIsOpen(false);
          getAllSkills();
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const closeModal = () => {
    setIsOpen(false);
    if (modalType === "edit") {
      reset();
    }
  };
  return (
    <>
      <Header
        handleOpenAddModal={openModal}
        title="Available Skills"
        description="Add or Edit available Skills"
      />
      <CustomBreadcrumb />
      <div className="mt-5 px-10 py-5 h-[650px] shadow-lg border rounded-lg max-h-[700px] overflow-auto">
        {allSkills.length >= 1 ? (
          <div className="grid lg:grid-cols-6 md:grid-cols-5 grid-cols-4 gap-6 ">
            {allSkills.map((skill: skillTypes, index: number) => (
              <SummaryCard
                key={index}
                summary={skill.name}
                id={skill._id}
                handleOpenDeleteModal={openModal}
                handleEditModalOpen={openModal}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="No Skills to show." />
        )}
      </div>

      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onAdd)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Skill">
            <CustomInput
              type="text"
              isRequired={true}
              id="skill"
              placeholder="Skill"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
            />
          </AddModal>
        </form>
      )}

      {isOpen && modalType === "edit" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onEdit)}>
          <AddModal handleModalClose={closeModal} modalTitle="Edit Skill">
            <div>
              <div className="max-w-md">
                <CustomInput
                  type="text"
                  isRequired={true}
                  id="skill"
                  placeholder="Skill"
                  register={register}
                  errors={errors}
                  errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                />
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
