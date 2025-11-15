import { type ChangeEvent, useState } from "react";

import useCustomLogin from "@/hooks/useCustomLogin";
import type { LoginForm, UseCustomLoginReturn } from "@/types/common";

const initialState: LoginForm = {
  username: "",
  password: "",
};

function LoginComponent() {
  const [loginParam, setLoginParam] = useState<LoginForm>({ ...initialState });

  const { doLogin, moveToPath }: UseCustomLoginReturn = useCustomLogin();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginParam((prevState) => ({
      ...prevState,
      [name]: value, // name을 키로 사용하여 값 업데이트
    }));
  };

  const handleClick = () => {
    doLogin(loginParam).then((data) => {
      if (data.errors) {
        alert("이메일과 패스워드를 다시 확인하세요");
      } else {
        alert("로그인 성공");
        moveToPath("/");
      }
    });
  };

  return (
    <div className="flex justify-center items-center flex-col max-w-1/3 w-1/3 border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Login
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="username"
            type={"text"}
            value={loginParam.username}
            onChange={handleChange}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="password"
            type={"password"}
            value={loginParam.password}
            onChange={handleChange}
          ></input>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
              onClick={handleClick}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
