import { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import colors from "@utils/colors";
import AuthNavigator from "./AuthNavigator";
import { getAuthState, Profile, updateAuthState } from "app/store/auth";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import client from "app/api/client";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingAnimation from "@components/ui/LoadingAnimation";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

const Navigator = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);

  const fetchAuthState = async () => {
    const token = await AsyncStorage.getItem("access-token");
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<{ profile: Profile }>(
        client.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  return (
    <NavigationContainer theme={MyTheme}>
      <LoadingAnimation visible={authState.pending} />
      <AuthNavigator />
    </NavigationContainer>
  );
};

export default Navigator;