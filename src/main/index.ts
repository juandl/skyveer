import * as path from "node:path";
import { GetCallerIdentityCommand, GetSessionTokenCommand, STSClient } from "@aws-sdk/client-sts";
import { app, BrowserWindow, ipcMain, Menu, type MenuItemConstructorOptions } from "electron";
//Shared
import { IPC, type LoginPayload } from "../shared/types/ipc";
//Types
import type {
  LoginResult,
  Profile,
  ProfileInput,
  Session,
  SessionVerification,
} from "../shared/types/profile";
//Constants
import { APP_NAME, DEV_SERVER_URL, WINDOW } from "./config/app";
import {
  AWS_CONFIG_PATH,
  AWS_CREDENTIALS_PATH,
  DEFAULT_REGION,
  DEFAULT_SECTION,
  SESSION_DURATION_SECONDS,
} from "./constants/aws";
import { regionConfigSection, sessionToCredentialsSection } from "./helpers/aws";
import { parseIniFile, writeIniFile } from "./helpers/ini";
//Helpers
import { loadProfiles, saveProfiles } from "./helpers/profiles";

ipcMain.handle(IPC.GET_PROFILES, (): Profile[] => loadProfiles());

ipcMain.handle(IPC.ADD_PROFILE, (_event, profile: ProfileInput): Profile[] => {
  const profiles = loadProfiles();

  if (profile.isDefault) {
    profiles.forEach((p) => {
      p.isDefault = false;
    });
  }

  const existingIndex = profiles.findIndex((p) => p.name === profile.name);
  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
  } else {
    profiles.push({ ...profile, session: null });
  }
  saveProfiles(profiles);
  return profiles;
});

ipcMain.handle(IPC.SET_DEFAULT, (_event, profileName: string): Profile[] => {
  const profiles = loadProfiles();
  profiles.forEach((p) => {
    p.isDefault = p.name === profileName;
  });
  saveProfiles(profiles);

  const profile = profiles.find((p) => p.name === profileName);

  if (profile?.session) {
    const creds = parseIniFile(AWS_CREDENTIALS_PATH);
    creds[DEFAULT_SECTION] = sessionToCredentialsSection(profile.session);
    writeIniFile(AWS_CREDENTIALS_PATH, creds);

    const config = parseIniFile(AWS_CONFIG_PATH);
    config[DEFAULT_SECTION] = regionConfigSection(profile.region);
    writeIniFile(AWS_CONFIG_PATH, config);
  }

  return profiles;
});

ipcMain.handle(IPC.DELETE_PROFILE, (_event, profileName: string): Profile[] => {
  let profiles = loadProfiles();
  profiles = profiles.filter((p) => p.name !== profileName);
  saveProfiles(profiles);

  const creds = parseIniFile(AWS_CREDENTIALS_PATH);
  delete creds[profileName];
  writeIniFile(AWS_CREDENTIALS_PATH, creds);

  const config = parseIniFile(AWS_CONFIG_PATH);
  delete config[`profile ${profileName}`];
  delete config[profileName];
  writeIniFile(AWS_CONFIG_PATH, config);

  return profiles;
});

ipcMain.handle(
  IPC.LOGIN,
  async (_event, { profileName, otpCode }: LoginPayload): Promise<LoginResult> => {
    const profiles = loadProfiles();
    const profile = profiles.find((p) => p.name === profileName);
    if (!profile) throw new Error("Profile not found");

    const stsClient = new STSClient({
      region: profile.region || DEFAULT_REGION,
      credentials: {
        accessKeyId: profile.accessKey,
        secretAccessKey: profile.secretKey,
      },
    });

    const params: {
      DurationSeconds: number;
      SerialNumber?: string;
      TokenCode?: string;
    } = { DurationSeconds: SESSION_DURATION_SECONDS };

    if (profile.mfaDevice && otpCode) {
      params.SerialNumber = profile.mfaDevice;
      params.TokenCode = otpCode;
    }

    const response = await stsClient.send(new GetSessionTokenCommand(params));
    const sessionCreds = response.Credentials;
    if (
      !sessionCreds?.AccessKeyId ||
      !sessionCreds.SecretAccessKey ||
      !sessionCreds.SessionToken ||
      !sessionCreds.Expiration
    ) {
      throw new Error("STS returned incomplete session credentials");
    }

    const session: Session = {
      accessKeyId: sessionCreds.AccessKeyId,
      secretAccessKey: sessionCreds.SecretAccessKey,
      sessionToken: sessionCreds.SessionToken,
      expiration: sessionCreds.Expiration.toISOString(),
    };

    const idx = profiles.findIndex((p) => p.name === profileName);
    profiles[idx].session = session;
    saveProfiles(profiles);

    const creds = parseIniFile(AWS_CREDENTIALS_PATH);
    const sessionCred = sessionToCredentialsSection(session);
    creds[profile.name] = sessionCred;
    if (profile.isDefault) {
      creds[DEFAULT_SECTION] = { ...sessionCred };
    }
    writeIniFile(AWS_CREDENTIALS_PATH, creds);

    const config = parseIniFile(AWS_CONFIG_PATH);
    const regionConfig = regionConfigSection(profile.region);
    const configSection =
      profile.name === DEFAULT_SECTION ? DEFAULT_SECTION : `profile ${profile.name}`;
    config[configSection] = regionConfig;
    if (profile.isDefault && profile.name !== DEFAULT_SECTION) {
      config[DEFAULT_SECTION] = { ...regionConfig };
    }
    writeIniFile(AWS_CONFIG_PATH, config);

    return { session, profiles };
  },
);

ipcMain.handle(IPC.LOGOUT, (_event, profileName: string): Profile[] => {
  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.name === profileName);
  const isDefault = idx >= 0 && profiles[idx].isDefault;

  if (idx >= 0) {
    profiles[idx].session = null;
    saveProfiles(profiles);
  }

  const creds = parseIniFile(AWS_CREDENTIALS_PATH);
  delete creds[profileName];
  if (isDefault) {
    delete creds[DEFAULT_SECTION];
  }
  writeIniFile(AWS_CREDENTIALS_PATH, creds);

  return profiles;
});

ipcMain.handle(
  IPC.VERIFY_SESSION,
  async (_event, profileName: string): Promise<SessionVerification> => {
    const profiles = loadProfiles();
    const profile = profiles.find((p) => p.name === profileName);
    if (!profile?.session) return { valid: false };

    const expiration = new Date(profile.session.expiration);
    if (expiration <= new Date()) {
      return { valid: false, reason: "Session expired" };
    }

    try {
      const stsClient = new STSClient({
        region: profile.region || DEFAULT_REGION,
        credentials: {
          accessKeyId: profile.session.accessKeyId,
          secretAccessKey: profile.session.secretAccessKey,
          sessionToken: profile.session.sessionToken,
        },
      });
      const identity = await stsClient.send(new GetCallerIdentityCommand({}));
      return {
        valid: true,
        identity: { account: identity.Account ?? "", arn: identity.Arn ?? "" },
      };
    } catch {
      return { valid: false, reason: "Session invalid" };
    }
  },
);

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: WINDOW.width,
    height: WINDOW.height,
    minWidth: WINDOW.minWidth,
    minHeight: WINDOW.minHeight,
    titleBarStyle: WINDOW.titleBarStyle,
    backgroundColor: WINDOW.backgroundColor,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL(DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "..", "dist", "index.html"));
  }
};

app.setName(APP_NAME);
if (process.platform === "darwin") {
  app.setAboutPanelOptions({ applicationName: APP_NAME });
}

const buildAppMenu = (): Menu => {
  const isMac = process.platform === "darwin";
  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? ([
          {
            label: APP_NAME,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ] satisfies MenuItemConstructorOptions[])
      : []),
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];
  return Menu.buildFromTemplate(template);
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(buildAppMenu());
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
