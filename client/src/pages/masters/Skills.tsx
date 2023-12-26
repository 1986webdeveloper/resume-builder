import SummaryCard from "../../components/shared/SummaryCard";
import { useEffect, useState } from "react";
import AddModal from "../../components/sections/AddModal";
import Input from "../../components/shared/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/sections/DeleteModal";
import Header from "../../components/shared/Header";
import { httpService } from "../../services/https";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";

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
        console.log(res);
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
      <div className="grid lg:grid-cols-5 md:grid-cols-4 grikd-cols-3 gap-6 mt-16">
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
      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onAdd)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Skill">
            <div>
              <div className="max-w-md">
                <Input
                  register={register}
                  type="text"
                  placeholder="Skill"
                  isRequired={true}
                  id="skill"
                  color={errors.skill ? "border-red-500" : ""}
                  errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                />
                {errors.skill?.type && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.skill?.message}
                  </p>
                )}
              </div>
            </div>
          </AddModal>
        </form>
      )}

      {isOpen && modalType === "edit" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onEdit)}>
          <AddModal handleModalClose={closeModal} modalTitle="Edit Skill">
            <div>
              <div className="max-w-md">
                <Input
                  register={register}
                  type="text"
                  placeholder="Skill"
                  isRequired={true}
                  id="skill"
                  color={errors.skill ? "border-red-500" : ""}
                  errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
                />
                {errors.skill?.type && (
                  <p className="text-red-600 mt-1 text-xs">
                    {errors.skill?.message}
                  </p>
                )}
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
