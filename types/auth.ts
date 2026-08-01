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

export type ParentAccount = {
  accountEmail: string;
  accountPhone: string;
  address: string;
  fatherEmail: string;
  fatherFirstName: string;
  fatherLastName: string;
  fatherOccupation: string;
  fatherPhone: string;
  id: string;
  maritalStatus: string;
  motherEmail: string;
  motherFirstName: string;
  motherLastName: string;
  motherOccupation: string;
  motherPhone: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  refreshToken: string;
  role: string;
  user: Staff;
};

export type ParentLoginResponse = {
  success: boolean;
  token: string;
  refreshToken: string;
  user: ParentAccount;
};

export interface RefreshStaffTokenResponse {
  success: boolean;
  token: string;
  refreshToken: string;
}
