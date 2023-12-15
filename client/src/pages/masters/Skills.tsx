import SummaryCard from "../../components/shared/SummaryCard";
import { useEffect, useState } from "react";
import { getSkills } from "../../services/masters/skills/getSkills";
import AddModal from "../../components/sections/AddModal";
import Input from "../../components/shared/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { addSkill } from "../../services/masters/skills/addSkill";
import { toast } from "react-toastify";
import Modal from "../../components/sections/DeleteModal";
import { updateSkill } from "../../services/masters/skills/updateSkill";
import { deleteSkill } from "../../services/masters/skills/deleteSkill";
import Header from "../../components/shared/Header";
import Breadcrumb from "../../components/shared/Breadcrumb";

interface skillTypes {
  name: string;
  _id: string;
}

export default function Skills() {
  const [allSkills, setAllSkills] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [openedId, setOpenedID] = useState("");
  const [activeSkill, setActiveSkill] = useState({ id: "", skill: "" });
  const token = localStorage.getItem("token") || "";

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
    getSkills(token).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setAllSkills(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getAllSkills();
  }, []);

  const handleOpenAddModal = () => {
    setIsOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setOpenedID(id);
    setIsOpenDeleteModal(true);
  };
  const handleDeleteModalClose = () => {
    setIsOpenDeleteModal(false);
  };
  const handleEditModalOpen = (id: string, skill: string) => {
    console.log(skill, id);
    setValue("skill", skill);
    setActiveSkill({ id: id, skill: skill });
    setIsOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    reset();
    setIsOpenEditModal(false);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    addSkill(token, { name: data.skill })
      .then((res) => {
        if (res.status === 201) {
          getAllSkills();
          toast.success(res.data?.message);
          setIsOpen(false);
          reset();
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.error);
      });
  };

  const onEditSubmit = (data: any) => {
    console.log(activeSkill);
    updateSkill(token, {
      skillId: activeSkill.id,
      name: data.skill,
    })
      .then((res) => {
        if (res.status === 200) {
          getAllSkills();
          toast.success(res.data?.message);
          setIsOpenEditModal(false);
          reset();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.error);
      });
  };

  const handleDelete = () => {
    if (openedId) {
      console.log(openedId);
      deleteSkill(token, { skillId: openedId })
        .then((res) => {
          if (res.status === 200) {
            toast.error(res.data?.message);
            setIsOpenDeleteModal(false);
            getAllSkills();
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.error);
        });
    }
  };
  return (
    <>
      <Header
        handleOpenAddModal={handleOpenAddModal}
        title="Available Skills"
        description="Add or Edit available Skills"
      />
      <Breadcrumb />
      <div className="grid lg:grid-cols-5 md:grid-cols-4 grikd-cols-3 gap-6 mt-16">
        {allSkills.map((skill: skillTypes, index: number) => (
          <SummaryCard
            key={index}
            summary={skill.name}
            id={skill._id}
            handleOpenDeleteModal={handleOpenDeleteModal}
            handleEditModalOpen={handleEditModalOpen}
          />
        ))}
      </div>
      {isOpen && (
        <form
          className="mx-auto max-w-xs mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <AddModal handleModalClose={handleModalClose} modalTitle="Add Skill">
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

      {isOpenEditModal && (
        <form
          className="mx-auto max-w-xs mt-3"
          onSubmit={handleSubmit(onEditSubmit)}
        >
          <AddModal
            handleModalClose={handleEditModalClose}
            modalTitle="Edit Skill"
          >
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

      {isOpenDeleteModal && (
        <Modal
          handleDeleteModalClose={handleDeleteModalClose}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
