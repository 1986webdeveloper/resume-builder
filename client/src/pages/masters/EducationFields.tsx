import { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import Breadcrumb from "../../components/shared/Breadcrumb";
import SummaryCard from "../../components/shared/SummaryCard";
import { getIndividualSummaries } from "../../services/masters/education/getIndividualSummaries";
import { useParams } from "react-router-dom";
import AddModal from "../../components/sections/AddModal";
import RichTextEditor from "../../components/shared/RichTextEditor";
import Modal from "../../components/sections/DeleteModal";
import Http from "../../services/http";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface summaryTypes {
  summary: string;
  _id: string;
}

export default function EducationFields() {
  const { degree } = useParams();
  const location = useLocation();
  const { id } = location.state;
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [allSummaries, setAllSummaries] = useState([]);
  const [textAreaData, setTextAreaData] = useState("");
  const [activeSummary, setActiveSummary] = useState({ id: "", summary: "" });
  const token = localStorage.getItem("token") || "";

  const getSummaries = () => {
    getIndividualSummaries(token, id as string).then((res) => {
      if (res.status === 200) {
        console.log(res);
        setAllSummaries(res.data?.data?.summaries);
      }
    });
  };
  useEffect(() => {
    getSummaries();
  }, []);

  const openModal = (
    id: string = "",
    summary: string = "",
    type: string = "add"
  ) => {
    setActiveSummary({ id: id, summary: summary });
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onAdd = (e: any) => {
    e.preventDefault();
    const body = {
      degreeType: degree,
      summary: textAreaData,
    };
    Http.post("education/addEducation", body, false)
      .then((res: any) => {
        if (res.status === 200) {
          toast.success(res.data?.data?.message);
          getSummaries();
          setIsOpen(false);
        }
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error);
      });
  };

  const onEdit = (e: any) => {
    e.preventDefault();
    const body = {
      educationId: id,
      summaryId: activeSummary.id,
      summary: textAreaData,
    };
    Http.post("education/editOrDeleteEducation", body, false)
      .then((res: any) => {
        if (res.status === 200) {
          toast.success(res.data?.data?.message);
          getSummaries();
          setIsOpen(false);
        }
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error);
      });
    console.log("submit");
  };

  const onDelete = () => {
    console.log("delete");
  };
  return (
    <>
      <Header
        handleOpenAddModal={openModal}
        title="Available Education Summaries"
        description="Add or Edit available Education Summaries"
      />
      <Breadcrumb />
      <div className="flex flex-col gap-3">
        {allSummaries.map((summary: summaryTypes, index) => (
          <SummaryCard
            key={index}
            summary={summary.summary}
            id={summary._id}
            handleOpenDeleteModal={openModal}
            handleEditModalOpen={openModal}
          />
        ))}
      </div>

      {isOpen && modalType === "add" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={(e) => onAdd(e)}>
          <AddModal handleModalClose={closeModal} modalTitle="Add Summary">
            <div>
              <div className="max-w-md">
                <RichTextEditor setTextAreaData={setTextAreaData} />
              </div>
            </div>
          </AddModal>
        </form>
      )}

      {isOpen && modalType === "edit" && (
        <form className="mx-auto max-w-xs mt-3" onSubmit={(e) => onEdit(e)}>
          <AddModal handleModalClose={closeModal} modalTitle="Edit Summary">
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

      {isOpen && modalType === "delete" && (
        <Modal handleDeleteModalClose={closeModal} handleDelete={onDelete} />
      )}
    </>
  );
}
