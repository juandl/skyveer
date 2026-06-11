import { notifications } from "@mantine/notifications";

//Constants
import { TOAST_TYPE, type ToastType } from "../constants/ui";

export const showToast = (message: string, type: ToastType = TOAST_TYPE.SUCCESS): void => {
  notifications.show({
    message,
    color: type === TOAST_TYPE.ERROR ? "red" : "teal",
    autoClose: 3000,
    withBorder: true,
  });
};
