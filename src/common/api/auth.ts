import { axiosInstance } from "@/common/axiosInstance";

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export async function registerAccount(body: RegisterForm): Promise<{ message: string }> {
  const res = await axiosInstance.post<{ message: string }>("/auth/register", body);
  return res.data;
}
