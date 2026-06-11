export const TOAST_DURATION_MS = 3000;

export const OTP_LENGTH = 6;

export const VIEW = {
  EMPTY: "empty",
  FORM: "form",
  DETAIL: "detail",
} as const;

export type View = (typeof VIEW)[keyof typeof VIEW];

export const TOAST_TYPE = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type ToastType = (typeof TOAST_TYPE)[keyof typeof TOAST_TYPE];

export const SESSION_STATUS = {
  NONE: "none",
  ACTIVE: "active",
  EXPIRED: "expired",
} as const;

export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];
