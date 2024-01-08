import { useEffect, useState } from "react";
import Card from "../../components/shared/Card";
import { useParams } from "react-router-dom";
import AddModal from "../../components/sections/AddModal";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../components/shared/RichTextEditor";
import Modal from "../../components/sections/DeleteModal";
import Header from "../../components/shared/Header";
import { httpService } from "../../services/https";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import { BsDatabaseExclamation } from "react-icons/bs";

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
  const [modalType, setModalType] = useState("");
  const [openedId, setOpenedID] = useState("");

  const { collection } = useParams();

  const getAvailableDesignations = () => {
    setIsLoading(true);
    httpService
      .get(`admin/getDesignationOrSummaryList`)
      .then((res: any) => {
        if (res.status === 200) {
          setIsLoading(false);
          setAvailableDesignations(res.data?.data);
          localStorage.setItem("designations", JSON.stringify(res.data?.data));
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getAllowedDesignationsFirst = () => {
    httpService.get(`admin/getAllowedDesignation`).then((res: any) => {
      if (res.status === 200) {
        setAllowedDesignations(res.data?.data);
      }
    });
  };

  useEffect(() => {
    getAvailableDesignations();
    getAllowedDesignationsFirst();
  }, [collection]);

  const openModal = (id: string, type: string = "add") => {
    setOpenedID(id);
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onAdd: SubmitHandler<Inputs> = (data) => {
    const body = {
      name: data?.designation,
      summary: textAreaData,
      type: collection?.toUpperCase(),
    };
    httpService
      .post(`admin/addDesignationSummary`, body)
      .then((res: any) => {
        if (res.status === 201) {
          getAvailableDesignations();
          toast.success(res.data?.message);
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const onDelete = () => {
    const body = {
      designationId: openedId,
      active: false,
    };
    httpService
      .post(`admin/updateDesignationOrSummary`, body)
      .then((res: any) => {
        if (res.status === 200) {
          getAvailableDesignations();
          toast.error(res.data?.message);
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
        title="Choose Designation"
        description="Select the designation which you want to modify."
      />
      <CustomBreadcrumb />
      {isLoading ? (
        <div className="font-bold text-xl">Loading...</div>
      ) : (
        <div>
          {availableDesignations.length >= 1 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grikd-cols-2 gap-6 mt-16">
              {availableDesignations.map((designation, index) => (
                <Card
                  key={index}
                  id={designation._id}
                  title={designation.name}
                  description="We've designed and built ecommerce experiences that have
                    driven sales."
                  route={designation.name}
                  handleOpenDeleteModal={openModal}
                  isEditable={false}
                />
              ))}
            </div>
          ) : (
            <div className="w-full min-h-[650px] flex justify-center items-center">
              <div className="flex flex-col gap-2 items-center justify-center">
                <BsDatabaseExclamation color="gray" size={60} />
                <p className="text-sm text-center ml-2 text-gray-400">
                  No Designations to show.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={handleSubmit(onAdd)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Designation">
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

      {isOpen && modalType === "delete" && (
        <Modal handleDeleteModalClose={closeModal} handleDelete={onDelete} />
      )}
    </>
  );
}
