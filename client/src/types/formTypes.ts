export interface personalFormTypes {
  full_name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  mobileNo: string;
  address: string;
  dob: string;
}

export interface designationFormTypes {
  designation: string;
  summary: string;
}

export interface experienceFormTypes {
  companyName: string;
  from: string;
  to: string;
  summary: string;
  designation: string;
  present: number;
}

export interface educationFormTypes {
  instituteName: string;
  from: string;
  to: string;
  performance: string;
  summary: string;
  education: string;
  present: boolean;
  label: string;
}

export interface skillsFormTypes {
  _id: string;
  name: string;
}
