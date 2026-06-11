//Constants

//Types
import type { Profile } from "../../shared/types/profile";
import { SESSION_STATUS, type SessionStatus } from "../constants/ui";

export const getSessionStatus = (profile: Profile): SessionStatus => {
  if (!profile.session) return SESSION_STATUS.NONE;
  return new Date(profile.session.expiration) <= new Date()
    ? SESSION_STATUS.EXPIRED
    : SESSION_STATUS.ACTIVE;
};

export const isSessionExpired = (expiration: string): boolean => new Date(expiration) <= new Date();
