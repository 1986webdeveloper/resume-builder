import { useEffect, useState } from "react";
import { MdAddCircle } from "react-icons/md";
import { useParams } from "react-router-dom";
import AddModal from "../../components/sections/AddModal";
import { getDesignationsWiseSummaries } from "../../services/masters/summary/getDesignationsWiseSummaries";
import { addSummary } from "../../services/masters/summary/addSummary";
import { deleteSingleField } from "../../services/masters/summary/deleteSingleField";
import SummaryCard from "../../components/shared/SummaryCard";
import RichTextEditor from "../../components/shared/RichTextEditor";
import { toast } from "react-toastify";
import Modal from "../../components/sections/DeleteModal";
import { updateSingleField } from "../../services/masters/summary/updateSingleField";

export default function AvailableFields() {
  const { id, collection } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [textAreaData, setTextAreaData] = useState("");
  const [openedId, setOpenedID] = useState("");
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [activeSummary, setActiveSummary] = useState({ id: "", summary: "" });
  const [availableSummaries, setAvailableSummaries] = useState([]);
  const token = localStorage.getItem("token") || "";

  type summarytypes = {
    _id: string;
    summary: string;
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const getSummaries = () => {
    getDesignationsWiseSummaries(
      token,
      designationDetails[0]._id,
      collection as string
    ).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setAvailableSummaries(res.data.data);
      }
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    // Call API for Add-Summary.
    if (textAreaData) {
      addSummary(token, {
        summary: textAreaData,
        type: collection?.toUpperCase(),
        name: id,
      })
        .then((res) => {
          if (res.status === 201) {
            getSummaries();
            setIsOpen(false);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.error);
        });
    }
    console.log(textAreaData, "Summary add");
  };

  const designations = JSON.parse(
    localStorage.getItem("designations") as string
  );
  const designationDetails = designations.filter(
    (designation: any) => designation.name === id
  );

  useEffect(() => {
    getSummaries();
  }, [id, collection]);

  const handleDeleteModalClose = () => {
    setIsOpenDeleteModal(false);
  };

  const handleOpenDeleteModal = (id: string) => {
    setOpenedID(id);
    setIsOpenDeleteModal(true);
  };

  const handleDelete = () => {
    if (openedId) {
      deleteSingleField(token, {
        summaryId: openedId,
        designationId: designationDetails[0]._id,
        type: collection,
      })
        .then((res) => {
          if (res.status === 200) {
            getSummaries();
            setIsOpenDeleteModal(false);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.data?.error);
        });
    }
  };

  const handleEditModalOpen = (id: string, summary: string) => {
    console.log(id);
    setActiveSummary({ id: id, summary: summary });
    setIsOpenEditModal(true);
  };

  const handleEditModalClose = () => {
    setIsOpenEditModal(false);
  };

  const onEditSubmit = (e: any) => {
    e.preventDefault();
    console.log("edited");
    updateSingleField(token, {
      summaryId: activeSummary.id,
      designationId: designationDetails[0]._id,
      title: textAreaData,
    })
      .then((res) => {
        if (res.status === 200) {
          getSummaries();
          setIsOpenEditModal(false);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.data?.error);
      });
  };

  return (
    <>
      <div className="max-w-full sm:text-center">
        <div className="flex justify-between items-center">
          <div className="self-center mx-auto">
            <h2 className="md:text-5xl text-3xl font-semibold tracking-tight">
              All Summaries
            </h2>
            <div className="flex justify-center">
              <p className=" mt-6 text-xl/8 font-medium text-gray-500 ">
                Add or Edit available summaries
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
        <form className="mx-auto max-w-xs mt-3" onSubmit={(e) => onSubmit(e)}>
          <AddModal
            handleModalClose={handleModalClose}
            modalTitle="Add Summary"
          >
            <div>
              <div className="max-w-md">
                <RichTextEditor setTextAreaData={setTextAreaData} />
              </div>
            </div>
          </AddModal>
        </form>
      )}

      {isOpenEditModal && (
        <form
          className="mx-auto max-w-xs mt-3"
          onSubmit={(e) => onEditSubmit(e)}
        >
          <AddModal
            handleModalClose={handleEditModalClose}
            modalTitle="Edit Summary"
          >
            <div>
              <div className="max-w-md">
                <RichTextEditor
                  setTextAreaData={setTextAreaData}
                  defaultData={activeSummary.summary}
                />
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

      <div className="flex flex-col gap-5 w-full">
        {availableSummaries.map((item: summarytypes) => (
          <SummaryCard
            key={item._id}
            summary={item.summary}
            id={item._id}
            handleOpenDeleteModal={handleOpenDeleteModal}
            handleEditModalOpen={handleEditModalOpen}
          />
        ))}
      </div>
    </>
  );
}
