import { useNavigation } from "@react-navigation/native";
import size from "@utils/size";
import { FC } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";

interface Props {
  backButton?: JSX.Element | null;
  center?: JSX.Element | null;
  right?: JSX.Element | null;
}

const AppHeader: FC<Props> = ({ backButton, center, right }) => {
  const { goBack, canGoBack } = useNavigation();
  return (
    <View style={styles.container}>
      {/* back button */}
      {canGoBack() && <Pressable onPress={goBack}>{backButton}</Pressable>}
      {/* center ui */}
      {center}
      {/* right ui */}
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: size.padding,
    paddingTop: Platform.OS === "ios" ? size.padding : 0,
  },
});

export default AppHeader;
