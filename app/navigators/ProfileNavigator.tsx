import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "@screens/Profile";

export type ProfileNavigatorParamList = {
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ProfileNavigatorParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
