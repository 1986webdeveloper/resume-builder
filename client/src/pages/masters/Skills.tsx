import { MdAddCircle } from "react-icons/md";
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
          setIsOpen(false);
          reset();
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.data?.error);
      });
  };

  const onEditSubmit = () => {
    console.log(activeSkill);
    updateSkill(token, {
      skillId: activeSkill.id,
      name: activeSkill.skill,
    }).then((res) => {
      console.log(res);
    });
  };

  const handleDelete = () => {
    if (openedId) {
      console.log(openedId);
      deleteSkill(token, { skillId: openedId })
        .then((res) => {
          if (res.status === 200) {
            setIsOpenDeleteModal(false);
            getAllSkills();
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.data?.error);
        });
    }
  };
  return (
    <>
      <div className="max-w-full sm:text-center">
        <div className="flex justify-between items-center">
          <div className="self-center mx-auto">
            <h2 className="md:text-5xl text-3xl font-semibold tracking-tight">
              Available Skills
            </h2>
            <div className="flex justify-center">
              <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
                Add or Edit available Skills
              </p>
            </div>
          </div>
          <button
            className="mr-5 bg-primary px-5 py-3 text-center rounded-lg text-white flex gap-2 items-center"
            onClick={() => setIsOpen(true)}
          >
            <MdAddCircle />
            <span>Add</span>
          </button>
        </div>
      </div>
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
