import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import SignIn from "app/screens/SignIn";
import SignUp from "app/screens/SignUp";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SignUp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});