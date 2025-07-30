import { FC } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Home from "app/screens/Home";

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;