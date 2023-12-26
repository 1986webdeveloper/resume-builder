import { Button, Checkbox, Label, Select, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import RichTextEditor from "../../shared/RichTextEditor";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { BsDatabaseExclamation } from "react-icons/bs";
import { httpService } from "../../../services/https";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";

interface Inputs {
  instituteName: string;
  from: string;
  to: string;
  performance: string;
  summary: string;
  education: string;
  present: boolean;
  label: string;
}

interface summaryTypes {
  _id: string;
  summary: string;
}

interface propTypes {
  id: string;
  resumeId: string;
}

interface educationtypes {
  _id: string;
  degreeType: string;
}

interface nextStepTypes {
  route: string;
  id: string;
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

export default function EducationForm({ id, resumeId }: propTypes) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [textAreaData, setTextAreaData] = useState("");
  const [summaries, setSummaries] = useState([] as summaryTypes[]);
  const [performances, setPerformances] = useState([] as performanceTypes[]);
  const [educationData, setEducationData] = useState([] as Inputs[]);
  const [onEditDataId, setOnEditDataId] = useState(null as number | null);
  const [educations, setEducations] = useState([] as educationtypes[]);
  const [selectedEducation, setSelectedEducation] = useState(
    {} as educationtypes
  );
  const [nextStepInfo, setNextStepInfo] = useState({} as nextStepTypes);
  const [clickedSummary, setClickedSummary] = useState({} as summaryTypes);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStepId = useSelector((state: RootState) => state.currentStep.id);

  const onAdd: SubmitHandler<Inputs> = (data) => {
    console.log(data, textAreaData);
    reset();
    setTextAreaData("");
    if (data && textAreaData) {
      if (!onEditDataId) {
        setEducationData((prev) => [
          ...prev,
          { ...data, summary: textAreaData },
        ]);
        const body = {
          resumeId: resumeId,
          step: currentStepId,
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
              setNextStepInfo({
                route: `/resume/${res.data?.data?.currentStep?.slug}`,
                id: res.data?.data?.currentStep?.sectionID,
              });
            }
          })
          .catch((err) => toast.error(err?.response));
      } else {
        setEducationData((prev) =>
          prev.map((exp, index) => {
            if (index === onEditDataId) {
              return { ...data, summary: textAreaData };
            }
            return exp;
          })
        );
        setOnEditDataId(null);
      }
    }
  };

  const onEdit = (data: Inputs, id: number) => {
    setOnEditDataId(id);
    setValue("instituteName", data.instituteName);
    setValue("from", data.from);
    setValue("to", data.to);
    setValue("performance", data.performance);
    setTextAreaData(data.summary);
  };

  const onDelete = (id: number) => {
    setEducationData((prev) =>
      prev.filter((edu, index) => {
        return index !== id;
      })
    );
  };

  const getEducation = () => {
    httpService.get(`education/getAllEducationDetails`).then((res: any) => {
      if (res.statusText === "OK") {
        setEducations(res.data?.data);
      }
    });
  };

  const getSummarySuggestions = () => {
    console.log(selectedEducation, "selectedEdu");
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
          value: "skills",
          id: nextStepInfo.id,
        })
      );
      // navigate(nextStepInfo.route, {
      //   state: { id: nextStepInfo.id, resumeId: resumeId },
      // });
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
    console.log("education", watch("education"));
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
          <div>
            <div className="mb-2 block">
              <Label htmlFor="education" value="Select Degree" />
            </div>
            <Select
              id="education"
              defaultValue=""
              {...register("education", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              color={errors?.education ? "failure" : ""}
            >
              <option value="" disabled>
                Select Education
              </option>
              {educations.map((education) => (
                <option key={education._id}>{education.degreeType}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="instituteName" value="Institute Name" />
            </div>
            <TextInput
              {...register("instituteName", {
                required: {
                  value: true,
                  message: "This field is required",
                },
                pattern: {
                  value: /^[^\s]+(?:$|.*[^\s]+$)/,
                  message: "There should be no empty spaces.",
                },
              })}
              id="instituteName"
              type="text"
              color={errors?.instituteName ? "failure" : ""}
            />
            {errors?.instituteName && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.instituteName?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="from" value="From" />
            </div>
            <input
              type="date"
              {...register("from", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              className="rounded-lg w-full"
            />
            {errors.from?.type && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.from?.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="present" {...register("present")} />
            <Label htmlFor="present">Currently Studying ?</Label>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="to" value="To" />
            </div>
            <input
              type="date"
              {...register("to")}
              className={`rounded-lg w-full ${
                isCurrentlyWorking ? "border-gray-400 text-gray-400" : ""
              }`}
              disabled={isCurrentlyWorking}
            />
            {errors.to?.type && (
              <p className="text-red-600 mt-1 text-xs">{errors.to?.message}</p>
            )}
          </div>
          <div className="flex justify-between">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="performance" value="Performance" />
              </div>
              <TextInput
                {...register("performance", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message: "There should be no empty spaces.",
                  },
                })}
                id="performance"
                type="text"
                color={errors?.performance ? "failure" : ""}
              />
              {errors?.performance && (
                <p className="text-red-600 mt-1 text-xs">
                  {errors.performance?.message}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="label" value="Label" />
              </div>
              <TextInput
                {...register("label", {
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                  pattern: {
                    value: /^[^\s]+(?:$|.*[^\s]+$)/,
                    message: "There should be no empty spaces.",
                  },
                })}
                id="label"
                type="text"
                color={errors?.label ? "failure" : ""}
              />
              {errors?.label && (
                <p className="text-red-600 mt-1 text-xs">
                  {errors.label?.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-2 block">
              <Label value="Summary" />
            </div>
            <RichTextEditor
              setTextAreaData={setTextAreaData}
              defaultData={clickedSummary.summary}
            />
          </div>
          <Button className="mt-2" type="submit">
            <span className="mr-2">
              <FaPlusCircle />
            </span>
            Add
          </Button>
          <Button color="success" onClick={onContinue}>
            Continue
          </Button>
        </form>
        <div className="min-w-[50%] max-w-[51%] min-h-[200px] max-h-[500px] overflow-y-auto shadow-xl border px-4 py-8 rounded-lg flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            {performances.map((performance) => (
              <div
                className="px-2 py-1 bg-gray-200 rounded-lg cursor-pointer"
                onClick={() => onClickPerformance(performance)}
              >
                <p>{performance.value}</p>
              </div>
            ))}
          </div>
          <div>
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
        <div className="min-w-[20%] max-w-[21%] min-h-[200px] max-h-[500px] overflow-y-auto flex flex-col gap-3">
          {educationData.map((education, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 bg-gray-100 px-4 py-4 rounded-lg"
            >
              <div className="flex items-center justify-between cursor-pointer">
                <p
                  className="font-lg font-bold"
                  onClick={() => onEdit(education, index)}
                >
                  {education.instituteName}
                </p>
                <Button
                  size="xs"
                  color="failure"
                  className="self-end"
                  onClick={() => onDelete(index)}
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
