import AppButton from "@components/ui/AppButton";
import CustomKeyAvoidingView from "@components/ui/CustomKeyAvoidingView";
import FormDivider from "@components/forms/FormDivider";
import FormInput from "@components/forms/FormInput";
import FormNavigator from "@components/forms/FormNavigator";
import WelcomeHeader from "@components/ui/WelcomeHeader";
import { FC } from "react";
import { View, StyleSheet } from "react-native";

interface Props {}

const SignIn: FC<Props> = (props) => {
  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput placeholder="Password" secureTextEntry />

          <AppButton title="Sign in" />

          <FormDivider />

          <FormNavigator leftTitle="Forget Password" rightTitle="Sign Up" />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 30,
  },
});

export default SignIn;