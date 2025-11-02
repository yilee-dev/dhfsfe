import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { getCookie, removeCookie, setCookie } from "../util/cookieUtil";
import type { LoginForm, LoginResponse, MemberUsername } from "../types/common";

export const loginPostAsync = createAsyncThunk<LoginResponse, LoginForm>(
  "loginPostAsync",
  (param: LoginForm) => {
    return loginPost(param);
  }
);

const initState: MemberUsername = {
  username: "",
};

const loadMemberCookie = () => {
  const memberInfo = getCookie("member");
  if (!memberInfo) return memberInfo;
};

const loginSlice = createSlice({
  name: "LoginSlice",

  initialState: loadMemberCookie() || initState,

  reducers: {
    login: (state, action): MemberUsername => {
      console.log("login.....", state, action);

      const data = action.payload;

      setCookie("member", JSON.stringify(data), 1);

      return { username: data.username };
    },
    logout: (): MemberUsername => {
      removeCookie("member");

      return { ...initState };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log("fulfilled", state, action);

        if (!action.payload.errors) {
          setCookie("member", JSON.stringify(action.payload), 1);
        }

        return action.payload;
      })

      .addCase(loginPostAsync.pending, (state, action) => {
        console.log("pending", state, action);
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected", state, action);
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
