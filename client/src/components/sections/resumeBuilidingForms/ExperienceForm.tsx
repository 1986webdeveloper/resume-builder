import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../shared/RichTextEditor";
import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { BsDatabaseExclamation } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { httpService } from "../../../services/https";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { experienceFormTypes } from "../../../types/formTypes";
import { updateFormData } from "../../../store/slices/formDataSlice";
import { getDesiredDataFromPreview } from "../../../services/helper";
import CustomDate from "../../shared/CustomDate";
import CustomInput from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";
import EmptyState from "../../shared/EmptyState";

interface summaryTypes {
  _id: string;
  summary: string;
}

interface designationTypes {
  _id: string;
  name: string;
}

interface nextStepTypes {
  route: string;
  id: string;
  title: string;
}

export default function ExperienceForm() {
  const formData: any = useSelector(
    (state: RootState) => state.formData.experience
  );
  const [textAreaData, setTextAreaData] = useState("");
  const [summaries, setSummaries] = useState([] as summaryTypes[]);
  const [experienceData, setExperienceData] = useState(formData?.data || []);
  const [onEditDataId, setOnEditDataId] = useState(null as number | null);
  const [allowedDesignations, setAllowedDesignations] = useState(
    [] as designationTypes[]
  );
  const [selectedDesignation, setSelectedDesignation] = useState(
    {} as designationTypes
  );
  const [clickedSummary, setClickedSummary] = useState({} as summaryTypes);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const [nextStepInfo, setNextStepInfo] = useState({} as nextStepTypes);
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.currentStep);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<experienceFormTypes | any>();

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
        `admin/getDesignationOrSummaryList?designationId=${selectedDesignation._id}&type=EXPERIENCE`
      )
      .then((res: any) => {
        if (res.status === 200) {
          setSummaries(res?.data?.data);
        }
      });
  };

  const onAdd: SubmitHandler<experienceFormTypes> = (data) => {
    reset();
    setTextAreaData("");
    if (data && textAreaData) {
      if (!onEditDataId) {
        const body = {
          resumeId: currentStep.resumeId,
          step: currentStep.sectionID,
          data: {
            ...data,
            customSummary: textAreaData,
            experienceId: selectedDesignation._id,
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
              setExperienceData(previewData.data);
              dispatch(
                updateFormData({
                  key: "experience",
                  value: previewData,
                })
              );
              setNextStepInfo({
                route: `${res.data?.data?.currentStep?.slug}`,
                id: res.data?.data?.currentStep?.sectionID,
                title: res.data?.data?.currentStep?.title,
              });
            }
          })
          .catch((err) => toast.error(err?.response));
      } else {
        setExperienceData((prev) =>
          prev.map((exp) => {
            if (exp._id === onEditDataId) {
              return { ...data, summary: textAreaData };
            }
            return exp;
          })
        );
        const body = {
          resumeId: currentStep.resumeId,
          elementId: onEditDataId,
          sectionId: formData?._id,
          data: {
            companyName: data.companyName,
            from: data.from,
            to: data.to,
            present: data.present,
            customSummary: textAreaData,
            experienceId: selectedDesignation._id,
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
                    key: "experience",
                    value: previewData,
                  })
                );
                toast.success(res?.data?.message);
              })
              .catch((err: any) => toast.error(err?.response));
          })
          .catch((err) => {
            toast.error(err?.message);
          });
        setOnEditDataId(null);
      }
    }
  };

  const onEdit = (data: experienceFormTypes, id: number) => {
    setOnEditDataId(id);
    setValue("companyName", data.companyName);
    setValue("from", data.from);
    setValue("to", data.to);
    setValue("designation", data.experienceData?.name);
    setTextAreaData(data.customSummary);
  };

  const onDelete = (id: number) => {
    setExperienceData((prev: experienceFormTypes[]) =>
      prev.filter((exp: any) => {
        return exp._id !== id;
      })
    );
    const body = {
      resumeId: currentStep.resumeId,
      elementId: id,
      sectionId: formData?._id,
      active: false,
      data: {},
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
            key: "experience",
            value: previewData,
          })
        );
      })
      .catch((err) => {
        toast.error(err?.error);
      });
  };

  const onSummaryClick = (summary: summaryTypes) => {
    setTextAreaData(summary.summary);
    setClickedSummary(summary);
  };

  const onContinue = () => {
    if (nextStepInfo.route) {
      dispatch(
        setCurrentStep({
          slug: nextStepInfo?.route,
          sectionID: nextStepInfo?.id,
          title: nextStepInfo?.title,
        })
      );
    }
  };

  useEffect(() => {
    if (!watch("present")) {
      setIsCurrentlyWorking(false);
    } else {
      setIsCurrentlyWorking(true);
    }
  }, [watch("present")]);

  useEffect(() => {
    getAllowedDesignations();
  }, []);

  useEffect(() => {
    if (selectedDesignation?._id) getSummarySuggestions();
  }, [selectedDesignation]);

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

  return (
    <div>
      <div className="flex justify-between mt-10 w-full">
        <form
          className="min-w-[25%] max-w-[26%] h-[500px] overflow-y-scroll shadow-xl px-6 py-8 rounded-lg border self-center flex flex-col gap-2"
          onSubmit={handleSubmit(onAdd)}
        >
          <CustomInput
            type="text"
            label="Company Name"
            isRequired={true}
            id="companyName"
            register={register}
            errors={errors}
            errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
            errMsg="There should be no empty spaces."
          />
          <CustomDate
            label="From"
            isRequired={true}
            id="from"
            register={register}
            errors={errors}
            disabled={false}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="present"
              {...register("present")}
              // onChange={onPresentlyWorking}
            />
            <Label htmlFor="present">Currently Working ?</Label>
          </div>
          <CustomDate
            label="To"
            isRequired={true}
            id="to"
            register={register}
            errors={errors}
            disabled={isCurrentlyWorking}
          />
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
              isError={textAreaData.length ? false : true}
            />
          </div>
          <Button outline className=" bg-primary" color="dark" type="submit">
            <span className="mr-2">
              <FaPlusCircle />
            </span>
            Add
          </Button>
          <Button
            color="success"
            onClick={onContinue}
            disabled={experienceData.length ? false : true}
          >
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
        <div className="min-w-[20%] max-w-[21%] min-h-[200px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
          {experienceData.map((exp: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 px-4 py-4 rounded-lg transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between cursor-pointer">
                <p
                  className="font-lg font-bold"
                  onClick={() => onEdit(exp, exp._id)}
                >
                  {exp.companyName}
                </p>
                <Button
                  size="xs"
                  color="failure"
                  className="self-end"
                  onClick={() => onDelete(exp._id)}
                >
                  <FaTrash size={10} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
