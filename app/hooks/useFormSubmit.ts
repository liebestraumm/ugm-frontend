import { useState } from "react";
import { yupValidate } from "@utils/validator";
import { showMessage } from "react-native-flash-message";
import * as yup from "yup";

interface UseFormSubmitOptions<T> {
  schema: yup.Schema;
  onSuccess: (values: T) => void | Promise<void>;
  onError?: (error: string) => void;
  successMessage?: string;
}

interface UseFormSubmitReturn<T> {
  isSubmitting: boolean;
  submit: (data: T) => Promise<void>;
}

const useFormSubmit = <T extends object>({
  schema,
  onSuccess,
  onError,
  successMessage,
}: UseFormSubmitOptions<T>): UseFormSubmitReturn<T> => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (data: T) => {
    try {
      setIsSubmitting(true);
      
      const { values, error } = await yupValidate(schema, data);

      if (error) {
        showMessage({ message: error, type: "danger" });
        onError?.(error);
        return;
      }

      if (values) {
        await onSuccess(values);
        
        if (successMessage) {
          showMessage({ message: successMessage, type: "success" });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      showMessage({ message: errorMessage, type: "danger" });
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submit,
  };
};

export default useFormSubmit; 