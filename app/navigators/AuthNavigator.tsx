import { FC } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";
import ForgetPassword from "@screens/ForgetPassword";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AuthNavigator;
