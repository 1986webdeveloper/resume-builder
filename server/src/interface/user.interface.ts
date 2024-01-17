//create user interface
export interface CreateUser {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
}

//update otp information
export interface UpdateOtp {
  otp: string;
}
