import axios from "axios";
import type { LoginForm, LoginResponse } from "@/types/common";

const host = import.meta.env.VITE_API_SERVER_HOST;

export const loginPost = async (
  loginParam: LoginForm
): Promise<LoginResponse> => {
  const body = {
    username: loginParam.username,
    password: loginParam.password,
  };

  const res = await axios.post<LoginResponse>(`${host}/api/sign-in`, body);

  return res.data;
};
