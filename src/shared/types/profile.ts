export interface Session {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
}

export interface Profile {
  name: string;
  accessKey: string;
  secretKey: string;
  mfaDevice: string | null;
  region: string;
  isDefault: boolean;
  session: Session | null;
}

export type ProfileInput = Omit<Profile, "session">;

export interface CallerIdentity {
  account: string;
  arn: string;
}

export type SessionVerification =
  | { valid: true; identity: CallerIdentity }
  | { valid: false; reason?: string };

export interface LoginResult {
  session: Session;
  profiles: Profile[];
}
