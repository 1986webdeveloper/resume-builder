import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../shared/RichTextEditor";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { BsDatabaseExclamation } from "react-icons/bs";
import { httpService } from "../../../services/https";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { educationFormTypes } from "../../../types/formTypes";
import { getDesiredDataFromPreview } from "../../../services/helper";
import { updateFormData } from "../../../store/slices/formDataSlice";
import CustomSelect from "../../shared/CustomSelect";
import CustomInput from "../../shared/CustomInput";
import CustomDate from "../../shared/CustomDate";
import EmptyState from "../../shared/EmptyState";

interface summaryTypes {
  _id: string;
  summary: string;
}

interface educationtypes {
  _id: string;
  degreeType: string;
}

interface nextStepTypes {
  route: string;
  id: string;
  title: string;
}

interface summaryTypes {
  _id: string;
  summary: string;
}

interface performanceTypes {
  _id: string;
  label: string;
  value: string;
}

export default function EducationForm() {
  const formData = useSelector((state: RootState) => state.formData.education);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<educationFormTypes | any>();

  const [textAreaData, setTextAreaData] = useState("");
  const [summaries, setSummaries] = useState([] as summaryTypes[]);
  const [performances, setPerformances] = useState([] as performanceTypes[]);
  const [educationData, setEducationData] = useState(
    formData.data || ([] as educationFormTypes[])
  );
  const [onEditDataId, setOnEditDataId] = useState(null as number | null);
  const [educations, setEducations] = useState([] as educationtypes[]);
  const [selectedEducation, setSelectedEducation] = useState(
    {} as educationtypes
  );
  const [nextStepInfo, setNextStepInfo] = useState({} as nextStepTypes);
  const [clickedSummary, setClickedSummary] = useState({} as summaryTypes);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.currentStep);

  const onAdd: SubmitHandler<educationFormTypes> = (data) => {
    reset();
    setTextAreaData("");
    if (data && textAreaData) {
      if (!onEditDataId) {
        const body = {
          resumeId: currentStep.resumeId,
          step: currentStep.sectionID,
          data: {
            ...data,
            customPerformance: { value: data.performance, label: data.label },
            customSummary: textAreaData,
            educationId: selectedEducation._id,
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
              setEducationData(previewData.data);
              dispatch(
                updateFormData({
                  key: "education",
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
        setEducationData((prev: educationFormTypes[]) =>
          prev.map((edu: educationFormTypes, index: number) => {
            if (edu._id === onEditDataId) {
              return { ...data, summary: textAreaData };
            }
            return edu;
          })
        );
        const eduObj = educations.find(
          (edu) => edu.degreeType === data.education
        );
        const body = {
          resumeId: currentStep.resumeId,
          elementId: onEditDataId,
          sectionId: formData?._id,
          data: {
            educationId: eduObj?._id,
            instituteName: data.instituteName,
            from: data.from,
            to: data.to,
            present: data.present,
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
                    key: "education",
                    value: previewData,
                  })
                );
                toast.success(res?.data?.message);
              })
              .catch((err: any) => toast.error(err?.response));
          })
          .catch((err) => {
            toast.error(err?.error);
          });
        setOnEditDataId(null);
      }
    }
  };

  const onEdit = (data: educationFormTypes, id: number) => {
    setOnEditDataId(id);
    setValue("instituteName", data.instituteName);
    setValue("from", data.from);
    setValue("to", data.to);
    setValue("performance", data.performance);
    setTextAreaData(data.customSummary);
  };

  const onDelete = (id: number) => {
    setEducationData((prev: educationFormTypes[]) =>
      prev.filter((edu) => {
        return edu._id !== id;
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
            key: "education",
            value: previewData,
          })
        );
      })
      .catch((err) => {
        toast.error(err?.error);
      });
  };

  const getEducation = () => {
    httpService.get(`education/getAllEducationDetails`).then((res: any) => {
      if (res.statusText === "OK") {
        setEducations(res.data?.data);
      }
    });
  };

  const getSummarySuggestions = () => {
    if (selectedEducation._id) {
      httpService
        .get(
          `education/getAllEducationDetails?educationId=${selectedEducation._id}`
        )
        .then((res: any) => {
          setSummaries(res.data?.data[0]?.summaries);
          setPerformances(res.data?.data[0]?.performances);
        });
    }
  };

  const onSummaryClick = (summary: summaryTypes) => {
    setTextAreaData(summary.summary);
    setClickedSummary(summary);
  };

  const onContinue = () => {
    if (nextStepInfo.route) {
      dispatch(
        setCurrentStep({
          slug: nextStepInfo.route,
          sectionID: nextStepInfo.id,
          title: nextStepInfo.title,
        })
      );
    }
  };

  const onClickPerformance = (performance: performanceTypes) => {
    setValue("performance", performance.value);
    setValue("label", performance.label);
  };

  useEffect(() => {
    if (!watch("present")) {
      setIsCurrentlyWorking(false);
    } else {
      setIsCurrentlyWorking(true);
    }
  }, [watch("present")]);

  useEffect(() => {
    getEducation();
  }, []);

  useEffect(() => {
    if (watch("education")) {
      const educationDetails = educations.find(
        (education: any) => education.degreeType === watch("education")
      );
      if (educationDetails) {
        setSelectedEducation(educationDetails);
      }
    }
  }, [watch("education")]);

  useEffect(() => {
    getSummarySuggestions();
  }, [selectedEducation]);

  return (
    <div>
      <div className="flex justify-between mt-10 w-full">
        <form
          className="min-w-[25%] max-w-[26%] h-[500px] overflow-y-scroll shadow-xl px-6 py-8 rounded-lg border self-center flex flex-col gap-2"
          onSubmit={handleSubmit(onAdd)}
        >
          <CustomSelect
            label="Select Degree"
            isRequired={true}
            id="education"
            register={register}
            errors={errors}
            defaultValue=""
            initialOption="Select Education"
            optionsData={educations}
            optionsKey="degreeType"
            disabled={false}
          />
          <CustomInput
            type="text"
            label="Institute Name"
            isRequired={true}
            id="instituteName"
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
            <Checkbox id="present" {...register("present")} />
            <Label htmlFor="present">Currently Studying ?</Label>
          </div>
          <CustomDate
            label="To"
            isRequired={true}
            id="to"
            register={register}
            errors={errors}
            disabled={isCurrentlyWorking}
          />
          <div className="flex gap-2">
            <CustomInput
              type="text"
              label="Performance"
              isRequired={true}
              id="performance"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              errMsg="There should be no empty spaces."
            />
            <CustomInput
              type="text"
              label="Performance Label"
              isRequired={true}
              id="label"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              errMsg="There should be no empty spaces."
            />
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
          <Button outline className=" bg-primary" color="dark" type="submit">
            <span className="mr-2">
              <FaPlusCircle />
            </span>
            Add
          </Button>
          <Button
            color="success"
            onClick={onContinue}
            disabled={educationData.length ? false : true}
          >
            Continue
          </Button>
        </form>
        <div className="min-w-[50%] max-w-[51%] min-h-[200px] max-h-[500px] overflow-y-auto shadow-xl border px-4 py-8 rounded-lg">
          {summaries.length >= 1 ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                {performances.map((performance) => (
                  <div
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-all duration-300 ease-in-out"
                    onClick={() => onClickPerformance(performance)}
                  >
                    <p>{performance.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {summaries.map((summary) => (
                  <div
                    key={summary._id}
                    className="shadow-lg border px-2 py-4 rounded-xl dark:bg-gray-800 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
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
            </div>
          ) : (
            <EmptyState description="No Summaries to show." />
          )}
        </div>
        <div className="min-w-[20%] max-w-[21%] min-h-[200px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
          {educationData?.map(
            (education: educationFormTypes, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 px-4 py-4 rounded-lg transition-all duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <p
                    className="font-lg font-bold"
                    onClick={() => onEdit(education, education._id)}
                  >
                    {education.instituteName}
                  </p>
                  <Button
                    size="xs"
                    color="failure"
                    className="self-end"
                    onClick={() => onDelete(education._id)}
                  >
                    <FaTrash size={10} />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
