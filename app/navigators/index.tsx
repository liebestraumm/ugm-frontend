import { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import colors from "@utils/colors";
import AuthNavigator from "./AuthNavigator";
import { Profile, updateAuthState } from "app/store/auth";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import client from "app/api/client";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingAnimation from "@components/ui/LoadingAnimation";
import useAuth from "@hooks/useAuth";
import TabNavigator from "./TabNavigator";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

export type ProfileRes = {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
};

const Navigator = () => {
  const dispatch = useDispatch();
  const { loggedIn, authState } = useAuth();

  const fetchAuthState = async () => {
    const token = await AsyncStorage.getItem("access-token");
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<ProfileRes>(
        client.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );
      if (res) {
        dispatch(
          updateAuthState({
            pending: false,
            profile: { ...res.data.profile, accessToken: token },
          })
        );
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []); // Only run once on mount, not when loggedIn changes

  console.log("Current authState:", authState);
  console.log("Current loggedIn:", loggedIn);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingAnimation visible={authState.pending} />
      {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
    </NavigationContainer>
  );
};

export default Navigator;
