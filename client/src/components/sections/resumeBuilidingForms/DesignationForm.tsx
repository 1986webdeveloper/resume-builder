import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { httpService } from "../../../services/https";
import { Button, Label, Select } from "flowbite-react";
import RichTextEditor from "../../shared/RichTextEditor";
import { BsDatabaseExclamation } from "react-icons/bs";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";

interface Inputs {
  designation: string;
  summary: string;
}

interface designationTypes {
  _id: string;
  name: string;
}

interface summaryTypes {
  _id: string;
  summary: string;
}

interface propTypes {
  resumeId: string;
}

export default function DesignationForm({ resumeId }: propTypes) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [allowedDesignations, setAllowedDesignations] = useState(
    [] as designationTypes[]
  );
  const [selectedDesignation, setSelectedDesignation] = useState(
    {} as designationTypes
  );
  const [summaries, setSummaries] = useState([] as summaryTypes[]);
  const [textAreaData, setTextAreaData] = useState("");
  const [clickedSummary, setClickedSummary] = useState({} as summaryTypes);
  const dispatch = useDispatch();

  const currentStepId = useSelector((state: RootState) => state.currentStep.id);

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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data && textAreaData) {
      const body = {
        resumeId: resumeId,
        step: currentStepId,
        data: {
          designationId: selectedDesignation?._id,
          customSummary: textAreaData,
        },
      };
      httpService
        .post(`resume/createUserResume`, body)
        .then((res: any) => {
          if (res.status === 201) {
            dispatch(
              setCurrentStep({
                value: res.data?.data?.currentStep?.slug,
                id: res.data?.data?.currentStep?.sectionID,
              })
            );
          }
        })
        .catch((err) => toast.error(err?.response));
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
            color={errors?.designation ? "failure" : ""}
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
            defaultData={clickedSummary.summary}
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
