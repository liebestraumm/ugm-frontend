import { Platform, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import Navigator from "@navigators/index";
import FlashMessage from "react-native-flash-message";
import { Provider } from "react-redux";
import store from "app/store";

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Navigator />
        <FlashMessage position="top" duration={3500} />
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
