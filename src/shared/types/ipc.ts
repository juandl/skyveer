export const IPC = {
  GET_PROFILES: "get-profiles",
  ADD_PROFILE: "add-profile",
  DELETE_PROFILE: "delete-profile",
  SET_DEFAULT: "set-default",
  LOGIN: "login",
  LOGOUT: "logout",
  VERIFY_SESSION: "verify-session",
} as const;

export type IpcChannel = (typeof IPC)[keyof typeof IPC];

export interface LoginPayload {
  profileName: string;
  otpCode: string | null;
}
