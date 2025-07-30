import colors from "@utils/colors";
import { FC, useState } from "react";
import { View, StyleSheet, TextInput, TextInputProps, Text } from "react-native";

interface Props extends TextInputProps {
  error?: string;
}

const FormInput: FC<Props> = ({ error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          isFocused ? styles.borderActive : styles.borderDeActive,
          error ? styles.borderError : null,
        ]}
        placeholderTextColor={colors.primary}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
  },
  borderDeActive: { borderWidth: 1, borderColor: colors.deActive },
  borderActive: { borderWidth: 1, borderColor: colors.primary },
  borderError: { borderWidth: 1, borderColor: "red" },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default FormInput;