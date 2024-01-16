import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { httpService } from "../../../services/https";
import { Button, Label } from "flowbite-react";
import RichTextEditor from "../../shared/RichTextEditor";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { designationFormTypes } from "../../../types/formTypes";
import { updateFormData } from "../../../store/slices/formDataSlice";
import { getDesiredDataFromPreview } from "../../../services/helper";
import CustomSelect from "../../shared/CustomSelect";
import EmptyState from "../../shared/EmptyState";

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
      .then(() => {
        httpService
          .get(`resume/resumeInfo?resumeId=${currentStep?.resumeId}`)
          .then((res: any) => {
            const previewData = getDesiredDataFromPreview(
              res.data?.data?.previewData?.steps,
              currentStep?.sectionID
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
            toast.success(res?.data?.message);
          })
          .catch((err: any) => toast.error(err?.response));
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
        <CustomSelect
          label="Select your designation"
          isRequired={true}
          id="designation"
          register={register}
          errors={errors}
          defaultValue=""
          initialOption="Select Designation"
          optionsData={allowedDesignations}
          optionsKey="name"
          disabled={false}
        />
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
                className="shadow-lg border px-2 py-4 rounded-xl cursor-pointer dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
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
          <EmptyState description="No Summaries to show." />
        )}
      </div>
    </div>
  );
}
