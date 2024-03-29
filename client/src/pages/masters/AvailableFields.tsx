import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddModal from "../../components/sections/AddModal";
import SummaryCard from "../../components/shared/SummaryCard";
import RichTextEditor from "../../components/shared/RichTextEditor";
import { toast } from "react-hot-toast";
import Modal from "../../components/sections/DeleteModal";
import Header from "../../components/shared/Header";
import { httpService } from "../../services/https";
import CustomBreadcrumb from "../../components/shared/CustomBreadcrumb";
import EmptyState from "../../components/shared/EmptyState";

type summarytypes = {
  _id: string;
  summary: string;
};

export default function AvailableFields() {
  const { id, collection } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [textAreaData, setTextAreaData] = useState("");
  const [activeSummary, setActiveSummary] = useState({ id: "", summary: "" });
  const [availableSummaries, setAvailableSummaries] = useState([]);
  const designations = JSON.parse(
    localStorage.getItem("designations") as string
  );
  const designationDetails = designations.filter(
    (designation: any) => designation.name === id
  );

  const getSummaries = () => {
    httpService
      .get(
        `admin/getDesignationOrSummaryList?designationId=${
          designationDetails[0]._id
        }&type=${collection?.toUpperCase()}`
      )
      .then((res: any) => {
        if (res.status === 200) {
          setAvailableSummaries(res.data?.data);
        }
      });
  };

  useEffect(() => {
    getSummaries();
  }, [id, collection]);

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
      summary: textAreaData,
      type: collection?.toUpperCase(),
      name: id,
    };
    httpService
      .post("admin/addDesignationSummary", body)
      .then((res: any) => {
        if (res.status === 201) {
          getSummaries();
          toast.success(res.data?.message);
          setIsOpen(false);
        }
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  const onEdit = (e: any) => {
    e.preventDefault();
    const body = {
      summaryId: activeSummary.id,
      designationId: designationDetails[0]._id,
      title: textAreaData,
    };
    httpService
      .post(`admin/updateDesignationOrSummary`, body)
      .then((res: any) => {
        if (res.status === 200) {
          getSummaries();
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
      summaryId: activeSummary.id,
      designationId: designationDetails[0]._id,
      type: collection,
      active: false,
    };
    httpService
      .post(`admin/updateDesignationOrSummary`, body)
      .then((res: any) => {
        getSummaries();
        toast.success(res.data?.message);
        setIsOpen(false);
      })
      .catch((err) => {
        toast.error(err.response);
      });
  };

  return (
    <>
      <Header
        handleOpenAddModal={openModal}
        title="All Summaries"
        description="Add or Edit available summaries."
      />
      <CustomBreadcrumb />
      <div className="mt-5 px-8 py-5 shadow-lg border h-[650px] rounded-lg  max-h-[700px] overflow-auto">
        {availableSummaries.length >= 1 ? (
          <div className="flex flex-col gap-5 w-full">
            {availableSummaries.map((item: summarytypes) => (
              <SummaryCard
                key={item._id}
                summary={item.summary}
                id={item._id}
                handleOpenDeleteModal={openModal}
                handleEditModalOpen={openModal}
              />
            ))}
          </div>
        ) : (
          <EmptyState description="No Summaries to show." />
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
