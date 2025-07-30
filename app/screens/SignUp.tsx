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
import { newUserSchema } from "@utils/validator";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import client from "app/api/client";
import { showMessage } from "react-native-flash-message";
import useAuth from "@hooks/useAuth";
import { updateAuthState } from "app/store/auth";
import { useDispatch } from "react-redux";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

interface Props {}

const SignUp: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(newUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSignUp = async (data: SignUpFormData) => {
    dispatch(updateAuthState({ profile: null, pending: true }));
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/sign-up", data)
    );

    if (!res?.success) {
      dispatch(updateAuthState({ profile: null, pending: false }));
      return;
    }
    dispatch(updateAuthState({ profile: null, pending: false }));
    showMessage({ message: res.data.message, type: "success" });
    signIn(data);
  };

  const { isSubmitting, submit } = useFormSubmit<SignUpFormData>({
    schema: newUserSchema,
    onSuccess: handleSignUp,
    successMessage: "Account created successfully!",
  });

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                placeholder="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <AppButton
            title={isSubmitting ? "Signing up..." : "Sign Up"}
            onPress={handleSubmit(submit)}
            disabled={isSubmitting}
          />

          <FormDivider />

          <FormNavigator
            leftTitle="Forget Password"
            rightTitle="Sign In"
            onRightPress={() => navigate("SignIn")}
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

export default SignUp;
