import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { httpService } from "../../../services/https";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentStep } from "../../../store/slices/currentStepSlice";
import { RootState } from "../../../store/store";
import { updateFormData } from "../../../store/slices/formDataSlice";
import { personalFormTypes } from "../../../types/formTypes";
import { toast } from "react-hot-toast";
import { getDesiredDataFromPreview } from "../../../services/helper";

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
    <form
      className="mx-auto max-w-4xl mt-10 shadow-xl px-6 py-8 rounded-lg border"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex gap-5 w-full">
        <div className="flex flex-col gap-6 w-full">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="full_name" value="Full Name" />
            </div>
            <TextInput
              {...register("full_name", {
                required: {
                  value: true,
                  message: "This field is required",
                },
                pattern: {
                  value: /^[^\s]+(?:$|.*[^\s]+$)/,
                  message: "There should be no empty spaces.",
                },
              })}
              id="full_name"
              type="text"
              // color={errors?.full_name ? "failure" : ""}
            />
            {errors?.full_name && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.full_name?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              {...register("email", {
                required: true,
                pattern: /^[^\s]+@[^\s]+\.[a-zA-Z]{2,}$/,
              })}
              id="email"
              type="text"
              placeholder="name@flowbite.com"
              // color={errors?.email ? "failure" : ""}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="country" value="Select your country" />
            </div>
            <Select
              id="country"
              {...register("country", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              defaultValue={initialCountry?.name || ""}
              // color={errors?.country ? "failure" : ""}
            >
              <option value="" disabled>
                Select Country
              </option>
              {allCountries.map((country: countryTypes) => (
                <option key={country.name}>{country.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="state" value="Select your State" />
            </div>
            <Select
              id="state"
              disabled={watch("country") ? false : true}
              {...register("state", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              defaultValue={initialState?.name || ""}
              // color={errors?.state ? "failure" : ""}
            >
              <option value="" disabled>
                Select State
              </option>
              {allStates.map((state: stateTypes) => (
                <option key={state.name}>{state.name}</option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="city" value="Select your City" />
            </div>
            <Select
              id="city"
              disabled={watch("state") ? false : true}
              {...register("city", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              defaultValue={initialCity}
              // color={errors?.city ? "failure" : ""}
            >
              <option value="" disabled>
                Select City
              </option>
              {allCities.map((city) => (
                <option key={city.name}>{city.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="mobileNo" value="Mobile No" />
            </div>
            <TextInput
              {...register("mobileNo", {
                required: {
                  value: true,
                  message: "This field is required",
                },
                pattern: {
                  value: /^[^\s]+(?:$|.*[^\s]+$)/,
                  message: "There should be no empty spaces.",
                },
                minLength: {
                  value: 10,
                  message: "Mobile No should be 10 digits",
                },
              })}
              id="mobileNo"
              type="number"
              // color={errors?.mobileNo ? "failure" : ""}
            />
            {errors.mobileNo?.type && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.mobileNo?.message}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="dob" value="Date of birth" />
            </div>
            <input
              type="date"
              {...register("dob", {
                required: {
                  value: true,
                  message: "This field is required",
                },
              })}
              className={`rounded-lg w-full bg-white dark:bg-gray-700 dark:text-gray-100 `}
            />
            {errors.dob?.type && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.dob?.message as string}
              </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="address" value="Address" />
            </div>
            <TextInput
              {...register("address", {
                required: {
                  value: true,
                  message: "This field is required",
                },
                pattern: {
                  value: /^[^\s]+(?:$|.*[^\s]+$)/,
                  message: "There should be no empty spaces.",
                },
              })}
              id="address"
              type="text"
              // color={errors?.address ? "failure" : ""}
            />
            {errors.address?.type && (
              <p className="text-red-600 mt-1 text-xs">
                {errors.address?.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <Button type="submit" color="success" className="px-10 mt-9 mx-auto">
        Continue
      </Button>
    </form>
  );
}
