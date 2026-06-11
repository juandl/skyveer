import * as os from "node:os";
import * as path from "node:path";

export const AWS_CREDENTIALS_PATH = path.join(os.homedir(), ".aws", "credentials");
export const AWS_CONFIG_PATH = path.join(os.homedir(), ".aws", "config");

export const DEFAULT_REGION = "us-east-1";
export const DEFAULT_OUTPUT_FORMAT = "json";
export const DEFAULT_SECTION = "default";

// 12 hours
export const SESSION_DURATION_SECONDS = 43200;

export const PROFILES_FILE = "profiles.json";
