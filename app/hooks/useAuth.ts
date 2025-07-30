import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { getAuthState, updateAuthState } from "app/store/auth";
import { useDispatch, useSelector } from "react-redux";

export interface SignInRes {
  data: {
    profile: {
      id: string;
      email: string;
      name: string;
      verified: boolean;
      avatar?: string;
    };
    tokens: {
      refresh: string;
      access: string;
    };
  };
}

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);

  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<SignInRes>(
      client.post("/auth/sign-in", userInfo)
    );

    if (res) {
      // store the tokens
      const { tokens, profile } = res.data;
      await AsyncStorage.setItem("access-token", tokens.access);
      await AsyncStorage.setItem("refresh-token", tokens.refresh);
      dispatch(updateAuthState({ profile: { data: profile }, pending: false }));
    } else {
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };
  const loggedIn = authState.profile ? true : false;

  return { signIn, authState, loggedIn };
};

export default useAuth;
