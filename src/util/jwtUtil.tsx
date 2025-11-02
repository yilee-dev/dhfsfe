import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie } from './cookieUtil';
import { LoginResponse } from '../types/common';

const jwtAxios = axios.create()

const host = import.meta.env.VITE_API_SERVER_HOST 

const refreshJWT = async (accessToken:string, refreshToken:string): Promise<LoginResponse> => {
 
  const header = {headers: {"Authorization":`Bearer ${accessToken}`}}
 
  const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`, header)
 
  console.log("----------------------")
  console.log(res.data)
 
  return res.data 
 }
 

const beforeReq = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<any> => {
  console.log('before request.............');

  const memberInfo = getCookie("member");

  if (!memberInfo) {
    console.log("Member Not Found");
    const error = new AxiosError('REQUIRE_LOGIN', 'ERR_REQUIRE_LOGIN', config);
    return Promise.reject(error);
  }

  const {accessToken} = memberInfo

  // Authorization 헤더 처리 
  config.headers.Authorization = `Bearer ${accessToken}`

  return config;  // 정상적인 config 반환
};

// fail request
const requestFail = (err: AxiosError): Promise<AxiosError> => {
  console.log('request error............');
  
  // 에러 발생 시 Promise.reject를 통해 에러 반환
  return Promise.reject(err);
};

// before return response
const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {
  console.log('before return response...........');
  
  // 응답 전 처리 (필요한 경우 데이터 수정)

  const data = res.data 

  if(data && data.error ==='ERROR_ACCESS_TOKEN'){

    const memberCookieValue = getCookie("member")
  
    const result = await refreshJWT( memberCookieValue.accessToken, memberCookieValue.refreshToken )
    console.log("refreshJWT RESULT", result)
  
    memberCookieValue.accessToken = result.accessToken
    memberCookieValue.refreshToken = result.refreshToken
  
    setCookie("member", JSON.stringify(memberCookieValue), 1)
  
    //원래의 호출 
    const originalRequest = res.config
  
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
  
    return await axios(originalRequest)
  }

  return res;
};

// fail response
const responseFail = (err: AxiosError): Promise<AxiosError> => {
  console.log('response fail error.............');
  return Promise.reject(err);
};

// 인터셉터 설정
jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;

