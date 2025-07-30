import colors from "@utils/colors";
import { FC } from "react";
import { View, StyleSheet, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { ANIMATION_REGISTRY } from "@constants/animationRegistry";

interface Props {
  visible: boolean;
}

const LoadingAnimation: FC<Props> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent>
      <View style={styles.container}>
        <LottieView
          source={ANIMATION_REGISTRY.loadingHand}
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backDrop,
  },
  loadingAnimation: {
    flex: 1,
    transform: [{ scale: 0.4 }],
  },
});

export default LoadingAnimation;
