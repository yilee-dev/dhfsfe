import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, Navigate, useNavigate } from "react-router";
import { loginPostAsync, logout } from "../slices/loginSlice";
import type { AppDispatch, RootState } from "../store";
import type {
  LoginForm,
  MemberUsername,
  UseCustomLoginReturn,
} from "@/types/common";
import type { AxiosResponse } from "axios";

const useCustomLogin = (): UseCustomLoginReturn => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const loginState: MemberUsername = useSelector(
    (state: RootState) => state.loginSlice
  ); //-------로그인 상태

  const isLogin = loginState.username ? true : false; //----------로그인 여부

  const doLogin = async (param: LoginForm) => {
    // loginPostAsync 액션을 디스패치하고 결과를 받기
    const loginResponse = dispatch(loginPostAsync(param)).unwrap();

    return loginResponse;
  };

  const doLogout = () => {
    //---------------로그아웃 함수

    dispatch(logout());
  };

  const moveToPath = (path: string) => {
    //----------------페이지 이동
    navigate({ pathname: path }, { replace: true });
  };

  const moveToLogin = () => {
    //----------------------로그인 페이지로 이동
    navigate({ pathname: "/member/login" }, { replace: true });
  };

  const moveToLoginReturn = () => {
    //----------------------로그인 페이지로 이동 컴포넌트
    return <Navigate to="/member/login" replace />;
  };

  const exceptionHandle = (ex: any) => {
    console.log("Exception------------------------");

    console.log(ex);

    if (ex.code === "ERR_REQUIRE_LOGIN") {
      navigate({ pathname: "/member/login" });
      return;
    }

    const errorMsg = ex.response.data.error;

    const errorStr = createSearchParams({ error: errorMsg }).toString();

    if (
      ex.response.data.message.includes("JWT expired") ||
      errorMsg === "REQUIRE_LOGIN"
    ) {
      alert("로그인 해야만 합니다.");
      navigate({ pathname: "/member/login", search: errorStr });
      return;
    }

    if (ex.response.data.error === "ERROR_ACCESSDENIED") {
      alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.");
      navigate({ pathname: "/member/login", search: errorStr });
      return;
    }
  };

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    moveToLoginReturn,
    exceptionHandle,
  };
};

export default useCustomLogin;
