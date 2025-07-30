import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import SignIn from "app/screens/SignIn";
import SignUp from "app/screens/SignUp";
import Navigator from "app/navigator";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
