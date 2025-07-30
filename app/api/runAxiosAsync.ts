import { AxiosResponse, AxiosError } from "axios";
import { showMessage } from "react-native-flash-message";

type AxiosResult<T> = {
  data: T;
  status: number;
  success: boolean;
};

export const runAxiosAsync = async <T>(
  promise: Promise<AxiosResponse<T>>
): Promise<AxiosResult<T> | null> => {
  try {
    const response = await promise;
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  } catch (error) {
    let message = (error as any).message;
    if (error instanceof AxiosError) {
      const response = error.response;
      if (response) {
        message = response.data.message;
      }
    }

    showMessage({ message, type: "danger" });
  }

  return null;
};
