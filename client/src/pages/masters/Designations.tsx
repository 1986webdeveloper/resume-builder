import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import { useParams } from "react-router-dom";
import { getDesignations } from "../../services/masters/designation/getDesignations";
import { MdAddCircle } from "react-icons/md";
import AddModal from "../../components/sections/AddModal";
import { addDesignation } from "../../services/masters/designation/addDesignation";
import { toast } from "react-toastify";
import { deleteDesignation } from "../../services/masters/designation/deleteDesignation";
import { getAllowedDesignations } from "../../services/masters/designation/getAllowedDesignations";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../components/shared/RichTextEditor";
import Modal from "../../components/sections/DeleteModal";
export default function Designations() {
  interface designationType {
    name: string;
    _id: string;
  }

  interface Inputs {
    designation: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);
  const [availableDesignations, setAvailableDesignations] = useState<
    designationType[]
  >([]);
  const [allowedDesignations, setAllowedDesignations] = useState([]);
  const [textAreaData, setTextAreaData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openedId, setOpenedID] = useState("");
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const { collection } = useParams();
  const token = localStorage.getItem("token");

  const getAvailableDesignations = () => {
    setIsLoading(true);
    getDesignations(token)
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          console.log(res);
          setAvailableDesignations(res.data?.data);
          localStorage.setItem("designations", JSON.stringify(res.data?.data));
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getAllowedDesignationsFirst = () => {
    getAllowedDesignations(token).then((res) => {
      if (res.status === 200) {
        setAllowedDesignations(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getAvailableDesignations();
    getAllowedDesignationsFirst();
  }, [collection]);

  const handleModalClose = () => {
    console.log("close");
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data?.designation, textAreaData, "onSubmitForm");
    if (data?.designation && textAreaData) {
      addDesignation(
        token,
        { designation: data?.designation, summary: textAreaData },
        collection
      )
        .then((res) => {
          if (res.status === 201) {
            getAvailableDesignations();
            setIsOpen(false);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.data?.error);
        });
    }
  };

  const handleDeleteModalClose = () => {
    setIsOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id: string) => {
    setOpenedID(id);
    setIsOpenDeleteModal(true);
  };

  const handleDelete = () => {
    if (openedId) {
      deleteDesignation(token, openedId)
        .then((res) => {
          if (res.status === 200) {
            getAvailableDesignations();
            setIsOpenDeleteModal(false);
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
              Choose Designation
            </h2>
            <div className="flex justify-center">
              <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
                Select the designation which you want to modify.
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
      {isOpen && (
        <form
          className="mx-auto max-w-xs mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <AddModal
            handleModalClose={handleModalClose}
            modalTitle="Add Designation"
          >
            <div>
              <div className="flex flex-col gap-4">
                <div>
                  <select
                    id="designation"
                    className=" border cursor-pointer rounded-md w-52 duration-300 p-4 bg-indigo-50"
                    {...register("designation", { required: true })}
                  >
                    <option value="" disabled className="bg-indigo-50">
                      Select Option
                    </option>
                    {allowedDesignations.map((designationName, index) => (
                      <option
                        key={index}
                        value={designationName}
                        className="capitalize bg-indigo-50"
                      >
                        {designationName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-md">
                  <RichTextEditor setTextAreaData={setTextAreaData} />
                </div>
              </div>
            </div>
          </AddModal>
        </form>
      )}

      {isOpenDeleteModal && (
        <Modal
          handleDeleteModalClose={handleDeleteModalClose}
          handleDelete={handleDelete}
          // handleEdit={handleEdit}
        />
      )}

      {isLoading ? (
        <div className="font-bold text-xl">Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
          {availableDesignations.map((designation, index) => (
            <Card
              key={index}
              id={designation._id}
              title={designation.name}
              description="We've designed and built ecommerce experiences that have
                driven sales."
              route={designation.name}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}
    </>
  );
}
