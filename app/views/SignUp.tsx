import AppButton from "@components/ui/AppButton";
import CustomKeyAvoidingView from "@components/ui/CustomKeyAvoidingView";
import FormDivider from "@components/form/FormDivider";
import FormInput from "@components/form/FormInput";
import FormNavigator from "@components/form/FormNavigator";
import WelcomeHeader from "@components/ui/WelcomeHeader";
import { FC } from "react";
import { View, StyleSheet } from "react-native";

interface Props {}

const SignUp: FC<Props> = (props) => {
  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput placeholder="Name" />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput placeholder="Password" secureTextEntry />

          <AppButton title="Sign Up" />

          <FormDivider />

          <FormNavigator leftTitle="Forget Password" rightTitle="Sign In" />
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

export default SignUp;