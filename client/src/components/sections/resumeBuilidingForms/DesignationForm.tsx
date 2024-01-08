import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { httpService } from "../../../services/https";
import { Button, Label, Select } from "flowbite-react";
import RichTextEditor from "../../shared/RichTextEditor";
import { BsDatabaseExclamation } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { designationFormTypes } from "../../../types/formTypes";
import { updateFormData } from "../../../store/slices/formDataSlice";
import { getDesiredDataFromPreview } from "../../../services/helper";

interface designationTypes {
  _id: string;
  name: string;
}

interface summaryTypes {
  _id: string;
  summary: string;
}

export default function DesignationForm() {
  const formData: any = useSelector(
    (state: RootState) => state.formData.designation
  );
  const initialDesignation = formData?.data
    ? formData?.data[0]?.designationData
    : {};
  const initialSummary = formData?.data ? formData?.data[0]?.customSummary : "";
  const [allowedDesignations, setAllowedDesignations] = useState(
    [] as designationTypes[]
  );
  const [selectedDesignation, setSelectedDesignation] = useState(
    initialDesignation as designationTypes
  );
  const [summaries, setSummaries] = useState([] as summaryTypes[]);
  const [textAreaData, setTextAreaData] = useState(initialSummary);
  const [clickedSummary, setClickedSummary] = useState({} as summaryTypes);
  const dispatch = useDispatch();

  const currentStep = useSelector((state: RootState) => state.currentStep);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<designationFormTypes>({
    defaultValues: formData?.data ? formData?.data[0] : "",
  });

  const getAllowedDesignations = () => {
    httpService.get(`admin/getDesignationOrSummaryList`).then((res: any) => {
      if (res.status === 200) {
        setAllowedDesignations(res?.data?.data);
      }
    });
  };

  const getSummarySuggestions = () => {
    httpService
      .get(
        `admin/getDesignationOrSummaryList?designationId=${selectedDesignation._id}&type=ABOUT`
      )
      .then((res: any) => {
        if (res.status === 200) {
          setSummaries(res?.data?.data);
        }
      });
  };

  useEffect(() => {
    getAllowedDesignations();
  }, []);

  useEffect(() => {
    if (formData?.data) {
      setValue("designation", selectedDesignation?.name);
    }
  }, [allowedDesignations]);

  useEffect(() => {
    if (watch("designation")) {
      const designationDetails = allowedDesignations.find(
        (designation: any) => designation.name === watch("designation")
      );
      if (designationDetails) {
        setSelectedDesignation(designationDetails);
      }
    }
  }, [watch("designation")]);

  useEffect(() => {
    if (selectedDesignation?._id) getSummarySuggestions();
  }, [selectedDesignation]);

  const onSummaryClick = (summary: summaryTypes) => {
    setTextAreaData(summary.summary);
    setClickedSummary(summary);
  };

  const onEdit = () => {
    const body = {
      resumeId: currentStep.resumeId,
      elementId: formData?.data[0]?._id,
      sectionId: formData?._id,
      data: {
        designationId: selectedDesignation?._id,
        customSummary: textAreaData,
      },
    };
    httpService
      .post(`resume/editOrDeleteUserResume`, body)
      .then((res: any) => {
        toast.success(res?.data?.message);
        const previewData = getDesiredDataFromPreview(
          res.data?.data?.steps,
          currentStep.sectionID
        );
        dispatch(
          updateFormData({
            key: "designation",
            value: previewData,
          })
        );
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  const onSubmit: SubmitHandler<designationFormTypes> = (data) => {
    if (formData?.data && formData?.data[0]?._id) {
      onEdit();
    } else {
      if (data && textAreaData) {
        const body = {
          resumeId: currentStep.resumeId,
          step: currentStep.sectionID,
          data: {
            designationId: selectedDesignation?._id,
            customSummary: textAreaData,
          },
        };
        httpService
          .post(`resume/createUserResume`, body)
          .then((res: any) => {
            if (res.status === 201) {
              const previewData = getDesiredDataFromPreview(
                res.data?.data?.previewData?.steps,
                currentStep.sectionID
              );
              dispatch(
                updateFormData({
                  key: "designation",
                  value: previewData,
                })
              );
              dispatch(
                setCurrentStep({
                  slug: res.data?.data?.currentStep?.slug,
                  sectionID: res.data?.data?.currentStep?.sectionID,
                  title: res.data?.data?.currentStep?.title,
                })
              );
            }
          })
          .catch((err) => toast.error(err?.response));
      }
    }
  };
  return (
    <div className="flex gap-10 mt-10 w-full">
      <form
        className="min-w-[25%] max-w-[26%] shadow-xl px-6 py-8 rounded-lg border self-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="designation" value="Select your designation" />
          </div>
          <Select
            id="designation"
            defaultValue=""
            {...register("designation", {
              required: {
                value: true,
                message: "This field is required",
              },
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/,
                message: "There should be no empty spaces.",
              },
            })}
            // color={errors?.designation ? "failure" : ""}
          >
            <option value="" disabled>
              Select Designation
            </option>
            {allowedDesignations.map((designation, index) => (
              <option key={index}>{designation.name}</option>
            ))}
          </Select>
        </div>
        <div className="mt-3">
          <div className="mb-2 block">
            <Label value="Summary" />
          </div>
          <RichTextEditor
            setTextAreaData={setTextAreaData}
            defaultData={textAreaData}
          />
        </div>
        <Button color="success" type="submit" className="px-10 mt-9 mx-auto">
          Continue
        </Button>
      </form>
      <div className="min-w-[50%] max-w-[51%] min-h-[200px] max-h-[500px] overflow-y-auto shadow-xl border px-4 py-8 rounded-lg">
        {summaries.length >= 1 ? (
          <div className="flex flex-col gap-3">
            {summaries.map((summary) => (
              <div
                key={summary._id}
                className="shadow-lg border px-2 py-4 rounded-xl cursor-pointer hover:bg-gray-100"
                onClick={() => onSummaryClick(summary)}
              >
                <div
                  className="capitalize text-sm"
                  dangerouslySetInnerHTML={{
                    __html: summary.summary as string,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col gap-2 items-center">
              <BsDatabaseExclamation color="gray" size={60} />
              <p className="text-sm text-center ml-2 text-gray-400">
                No Summaries to show.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
