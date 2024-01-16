import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { httpService } from "../../../services/https";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { updateFormData } from "../../../store/slices/formDataSlice";
import { personalFormTypes } from "../../../types/formTypes";
import { toast } from "react-hot-toast";
import { getDesiredDataFromPreview } from "../../../services/helper";
import CustomInput from "../../shared/CustomInput";
import CustomSelect from "../../shared/CustomSelect";
import CustomDate from "../../shared/CustomDate";

interface countryTypes {
  name: string;
  code: string;
}

interface stateTypes {
  name: string;
  stateCode: string;
}

interface cityTypes {
  name: string;
}

export default function PersonalForm() {
  const formData: any = useSelector(
    (state: RootState) => state.formData.personal
  );

  const initialCountry = formData?.data
    ? {
        name: formData?.data[0].countries?.name,
        code: formData?.data[0].countries?.code,
      }
    : {};
  const initialState = formData?.data
    ? {
        name: formData?.data[0].states?.name,
        stateCode: formData?.data[0].states?.stateCode,
      }
    : {};
  const initialCity = formData?.data ? formData?.data[0]?.city : "";
  const [allCountries, setAllCountries] = useState([] as countryTypes[]);
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountry as countryTypes
  );
  const [selectedState, setSelectedState] = useState(
    initialState as stateTypes
  );
  const [allStates, setAllStates] = useState([] as stateTypes[]);
  const [allCities, setAllCities] = useState([] as cityTypes[]);
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.currentStep);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<personalFormTypes>({
    defaultValues: formData?.data ? formData?.data[0] : "",
  });

  const getAllCountries = () => {
    httpService.get(`helper/getAllCounties`).then((res: any) => {
      if (res.status === 200) {
        setAllCountries(res.data?.data);
      }
    });
  };

  const getAllStates = () => {
    if (selectedCountry?.code)
      httpService
        .get(`helper/getAllState?countryCode=${selectedCountry.code}`)
        .then((res: any) => {
          if (res.status === 200) {
            setAllStates(res.data?.data);
          }
        });
  };

  const getAllCities = () => {
    if (selectedCountry?.code && selectedState?.stateCode)
      httpService
        .get(
          `helper/getAllCities?countryCode=${selectedCountry.code}&stateCode=${selectedState.stateCode}`
        )
        .then((res: any) => {
          if (res.status === 200) {
            setAllCities(res.data?.data);
          }
        });
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (formData?.data) {
      setValue("country", selectedCountry.name);
      setValue("state", selectedState.name);
      setValue("city", getValues("city"));
    }
  }, [allCountries, allStates, allCities]);

  useEffect(() => {
    if (watch("country")) {
      const selectedCountryObject = allCountries.find(
        (country: countryTypes) => country.name === watch("country")
      );
      if (selectedCountryObject) {
        setSelectedCountry(selectedCountryObject);
      }
    }
  }, [watch("country")]);

  useEffect(() => {
    if (watch("state")) {
      const selectedStateObject = allStates.find(
        (state: stateTypes) => state.name === watch("state")
      );
      if (selectedStateObject) {
        setSelectedState(selectedStateObject);
      }
    }
  }, [watch("state")]);

  useEffect(() => {
    getAllStates();
  }, [selectedCountry]);

  useEffect(() => {
    getAllCities();
  }, [selectedState]);

  const onEdit = (data: any) => {
    const body = {
      resumeId: currentStep?.resumeId,
      elementId: formData?.data[0]?._id,
      sectionId: formData?._id,
      data: {
        full_name: data.full_name,
        email: data.email,
        city: data.city,
        mobileNo: data.mobileNo,
        address: data.address,
        dob: data.dob,
        country: selectedCountry.code,
        state: selectedState.stateCode,
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
                key: "personal",
                value: previewData,
              })
            );
            toast.success(res?.data?.message);
            dispatch(
              setCurrentStep({
                slug: res.data?.data?.currentStep?.slug,
                sectionID: res.data?.data?.currentStep?.sectionID,
                title: res.data?.data?.currentStep?.title,
              })
            );
          })
          .catch((err: any) => toast.error(err?.response));
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  const onSubmit: SubmitHandler<personalFormTypes> = (data) => {
    if (formData?.data && formData?.data[0]?._id) {
      onEdit(data);
    } else {
      const body = {
        step: currentStep?.sectionID,
        data: {
          ...data,
          country: selectedCountry.code,
          state: selectedState.stateCode,
        },
      };
      httpService.post(`resume/createUserResume`, body).then((res: any) => {
        if (res.status === 201) {
          dispatch(
            setCurrentStep({
              slug: res.data?.data?.currentStep?.slug,
              sectionID: res.data?.data?.currentStep?.sectionID,
              title: res.data?.data?.currentStep?.title,
              resumeId: res.data?.data?.previewData?._id,
            })
          );
          dispatch(
            updateFormData({
              key: "personal",
              value: {
                _id: res.data?.data?.previewData?.steps[0]?._id,
                data: res.data?.data?.previewData?.steps[0]?.data,
              },
            })
          );
        }
      });
    }
  };

  return (
    <>
      <form
        className="mx-auto max-w-4xl mt-10 shadow-xl px-6 py-8 rounded-lg border"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-5 w-full">
          <div className="flex flex-col gap-6 w-full">
            <CustomInput
              type="text"
              label="Full Name"
              isRequired={true}
              id="full_name"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              errMsg="There should be no empty spaces."
            />
            <CustomInput
              type="text"
              label="Email"
              isRequired={true}
              id="email"
              placeholder="johndoe@gmail.com"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/}
              errMsg="Please type valid email address."
            />
            <CustomSelect
              label="Select Country"
              isRequired={true}
              id="country"
              register={register}
              errors={errors}
              defaultValue={initialCountry?.name}
              initialOption="Select Country"
              optionsData={allCountries}
              optionsKey="name"
              disabled={false}
            />
            <CustomSelect
              label="Select State"
              isRequired={true}
              id="state"
              register={register}
              errors={errors}
              defaultValue={initialState?.name}
              initialOption="Select State"
              optionsData={allStates}
              optionsKey="name"
              disabled={watch("country") ? false : true}
            />
          </div>
          <div className="flex flex-col gap-6 w-full">
            <CustomSelect
              label="Select City"
              isRequired={true}
              id="city"
              register={register}
              errors={errors}
              defaultValue={initialCity}
              initialOption="Select City"
              optionsData={allCities}
              optionsKey="name"
              disabled={watch("state") ? false : true}
            />
            <CustomInput
              type="number"
              label="Mobile Number"
              isRequired={true}
              id="mobileNo"
              register={register}
              errors={errors}
              errorPattern={/^\d{10}$/}
              errMsg="Mobile number should be valid."
            />
            <CustomDate
              label="Date of birth"
              isRequired={true}
              id="dob"
              register={register}
              errors={errors}
              disabled={false}
            />
            <CustomInput
              type="text"
              label="Address"
              isRequired={true}
              id="address"
              register={register}
              errors={errors}
              errorPattern={/^[^\s]+(?:$|.*[^\s]+$)/}
              errMsg="There should be no empty spaces."
            />
          </div>
        </div>
        <Button type="submit" color="success" className="px-10 mt-9 mx-auto">
          Continue
        </Button>
      </form>
      {/* {formData?.data && formData?.data[0]?._id && (
        <Button color="failure" className="px-12 mt-9 ml-auto">
          Cancel
        </Button>
      )} */}
    </>
  );
}
