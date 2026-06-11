//Constants

//Types
import type { Session } from "../../shared/types/profile";
import { DEFAULT_OUTPUT_FORMAT, DEFAULT_REGION } from "../constants/aws";

export const sessionToCredentialsSection = (session: Session): Record<string, string> => ({
  aws_access_key_id: session.accessKeyId,
  aws_secret_access_key: session.secretAccessKey,
  aws_session_token: session.sessionToken,
});

export const regionConfigSection = (region: string): Record<string, string> => ({
  region: region || DEFAULT_REGION,
  output: DEFAULT_OUTPUT_FORMAT,
});
