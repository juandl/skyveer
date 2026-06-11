//Types
import type { LoginResult, Profile, ProfileInput, SessionVerification } from "./profile";

export interface ElectronAPI {
  getProfiles: () => Promise<Profile[]>;
  addProfile: (profile: ProfileInput) => Promise<Profile[]>;
  deleteProfile: (name: string) => Promise<Profile[]>;
  setDefault: (name: string) => Promise<Profile[]>;
  login: (profileName: string, otpCode: string | null) => Promise<LoginResult>;
  logout: (profileName: string) => Promise<Profile[]>;
  verifySession: (profileName: string) => Promise<SessionVerification>;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
