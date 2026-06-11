import * as fs from "node:fs";
import * as path from "node:path";
import { app } from "electron";
//Types
import type { Profile } from "../../shared/types/profile";
//Constants
import { PROFILES_FILE } from "../constants/aws";

const getProfilesPath = (): string => path.join(app.getPath("userData"), PROFILES_FILE);

export const loadProfiles = (): Profile[] => {
  try {
    const profilesPath = getProfilesPath();
    if (fs.existsSync(profilesPath)) {
      return JSON.parse(fs.readFileSync(profilesPath, "utf-8")) as Profile[];
    }
  } catch (e) {
    console.error("Failed to load profiles:", e);
  }
  return [];
};

export const saveProfiles = (profiles: Profile[]): void => {
  fs.writeFileSync(getProfilesPath(), JSON.stringify(profiles, null, 2));
};
