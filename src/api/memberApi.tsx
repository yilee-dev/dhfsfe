import axios from "axios";
import { type LoginForm, type LoginResponse } from "../types/common";
import jwtAxios from "../util/jwtUtil";

const host = import.meta.env.VITE_API_SERVER_HOST + "/api/member";

export const loginPost = async (
  loginParam: LoginForm
): Promise<LoginResponse> => {
  const header = { headers: { "Content-Type": "application/json" } };

  const form = new FormData();
  form.append("username", loginParam.email);
  form.append("password", loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

export const modifyMember = async (member: LoginForm) => {
  const res = await jwtAxios.put(`${host}/modify`, member);

  return res.data;
};
