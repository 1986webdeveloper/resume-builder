import { useEffect, useState } from "react";
import Header from "../../components/shared/Header";
import SummaryCard from "../../components/shared/SummaryCard";
import { useParams } from "react-router-dom";
import AddModal from "../../components/sections/AddModal";
import RichTextEditor from "../../components/shared/RichTextEditor";
import Modal from "../../components/sections/DeleteModal";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { httpService } from "../../services/https";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import { BsDatabaseExclamation } from "react-icons/bs";

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

  const getSummaries = () => {
    httpService
      .get(`education/getAllEducationDetails?educationId=${id}`)
      .then((res: any) => {
        setAllSummaries(res.data?.data[0]?.summaries);
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
    httpService
      .post("education/addEducation", body)
      .then((res: any) => {
        if (res.statusText === "OK") {
          toast.success(res.data?.message);
          getSummaries();
          setIsOpen(false);
        }
      })
      .catch((err) => {
        console.log(err, "error");
        toast.error(err.response);
      });
  };

  const onEdit = (e: any) => {
    e.preventDefault();
    const body = {
      educationId: id,
      summaryId: activeSummary.id,
      summary: textAreaData,
    };
    httpService
      .post("education/editOrDeleteEducation", body)
      .then((res: any) => {
        if (res.statusText === "OK") {
          toast.success(res.data?.message);
          getSummaries();
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const onDelete = () => {
    console.log("delete");
    const body = {
      educationId: id,
      summaryId: activeSummary.id,
      active: false,
    };
    httpService
      .post("education/editOrDeleteEducation", body)
      .then((res: any) => {
        if (res.statusText === "OK") {
          toast.success(res.data?.message);
          getSummaries();
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
        title="Available Education Summaries"
        description="Add or Edit available Education Summaries"
      />
      <CustomBreadcrumb />
      <div className="mt-5 px-8 py-5 h-full shadow-lg border rounded-lg max-h-[700px] overflow-auto">
        {allSummaries.length >= 1 ? (
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
        ) : (
          <div className="w-full min-h-[650px] flex justify-center items-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              <BsDatabaseExclamation color="gray" size={60} />
              <p className="text-sm text-center ml-2 text-gray-400">
                No Summaries to show.
              </p>
            </div>
          </div>
        )}
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
