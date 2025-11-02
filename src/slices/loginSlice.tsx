import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { getCookie, removeCookie, setCookie } from "../util/cookieUtil";
import { LoginForm, LoginResponse, MemberEmail } from "../types/common";


export const loginPostAsync = createAsyncThunk<LoginResponse,LoginForm>('loginPostAsync', (param : LoginForm) => {

  return loginPost(param)
 })
 


const initState : MemberEmail = {
  email:''
}

const loadMemberCookie = () => { //쿠키에서 로그인 정보 로딩 

  const memberInfo = getCookie("member")
 
  //닉네임 처리 
  if(memberInfo && memberInfo.nickname) {
   memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
  }
 
  return memberInfo
 }
 

const loginSlice = createSlice({
  
  name: 'LoginSlice',

  initialState: loadMemberCookie() || initState,
  
  reducers: {
    login: (state, action) : MemberEmail => {
      console.log("login.....", state, action)

      const data = action.payload

      setCookie("member",JSON.stringify(data), 1)

      return {email: data.email}

    },
    logout:  () : MemberEmail  => {
      console.log("logout....")

      removeCookie("member")

      return {...initState}
    }
  },


  extraReducers: (builder) => {
    
    builder.addCase( loginPostAsync.fulfilled, (state, action) => { 
      console.log("fulfilled", state, action)

      if(!action.payload.error) {
        setCookie("member", JSON.stringify(action.payload), 1)
      }

      return action.payload
    })

    .addCase(loginPostAsync.pending, (state,action) => {
      console.log("pending", state, action)
    })
    .addCase(loginPostAsync.rejected, (state,action) => {
      console.log("rejected", state, action)
    })
   }
  

})

export const {login,logout} = loginSlice.actions


export default loginSlice.reducer
