import { AxiosError } from "axios";

interface ResultModal {
  title: string;
  content: string;
  callbackFn?: () => void;
}

interface MemberUsername {
  username: string;
}

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  nickname: string;
  roles: string[];
  joinDate: string;
  isDisabled: boolean;
  disabledAt: string;
  accessToken: string;
  refreshToken: string;
  errors?: string;
}

interface UseCustomLoginReturn {
  loginState: MemberEmail;
  isLogin: boolean;
  doLogin: (param: LoginForm) => Promise<LoginResponse>;
  doLogout: () => void;
  moveToPath: (path: string) => void;
  moveToLogin: () => void;
  moveToLoginReturn: () => JSX.Element;
  exceptionHandle: (ex: any) => void;
}
