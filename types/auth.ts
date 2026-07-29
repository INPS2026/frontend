export type Staff = {
  id: string;
  staffId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  type: string;
  role: string;
  status: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  refreshToken: string;
  role: string;
  user: Staff;
};
