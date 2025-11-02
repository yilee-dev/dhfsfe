import { AxiosError } from "axios"


interface ResultModal {

  title:string,
  content: string,
  callbackFn? :  () => void 

}



interface MemberEmail {

  email: string 

}

interface LoginForm {

  email:string,
  pw:string,
  nickname ? : string

}

interface LoginResponse {
  email: string,
  nickname: string,
  social:boolean,
  pw:string,
  accessToken:string,
  roleNames: string[],
  refreshToken: string,
  error?: string
}



interface UseCustomLoginReturn {
  loginState:MemberEmail,
  isLogin: boolean,
  doLogin: (param: LoginForm) => Promise<LoginResponse>,
  doLogout: () => void,
  moveToPath: (path:string) => void,
  moveToLogin: () => void,
  moveToLoginReturn: () => JSX.Element,
  exceptionHandle: (ex:any) => void
}


