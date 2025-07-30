import AppButton from "@components/ui/AppButton";
import CustomKeyAvoidingView from "@components/ui/CustomKeyAvoidingView";
import FormDivider from "@components/forms/FormDivider";
import FormInput from "@components/forms/FormInput";
import FormNavigator from "@components/forms/FormNavigator";
import WelcomeHeader from "@components/ui/WelcomeHeader";
import { FC } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "@navigators/AuthNavigator";
import useFormSubmit from "@hooks/useFormSubmit";
import { forgetPasswordSchema } from "@utils/validator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { useDispatch } from "react-redux";
import { updateAuthState } from "app/store/auth";
import client from "app/api/client";
import { showMessage } from "react-native-flash-message";

interface ForgetPasswordFormData {
  email: string;
}

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>({
    resolver: yupResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgetPassword = async (data: ForgetPasswordFormData) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-password", data)
    );

    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  const { isSubmitting, submit } = useFormSubmit<ForgetPasswordFormData>({
    schema: forgetPasswordSchema,
    onSuccess: handleForgetPassword,
  });

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <AppButton
            title={isSubmitting ? "Requesting..." : "Request Link"}
            onPress={handleSubmit(submit)}
            disabled={isSubmitting}
          />

          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("SignUp")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Sign Up"
            rightTitle="Sign In"
          />
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

export default ForgetPassword;
