export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "creator" | "admin" | "user";
  status?: "pending" | "approved" | "rejected";
}

export interface IAuthState {
  token: string | null;
  user: IUser | null;
  didTryAutoLogin: boolean;
  isAuth: boolean;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface AdminUserDto {
  id: string;
  email: string;
  name: string;
  role: "creator" | "admin" | "user";
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}
