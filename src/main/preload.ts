import { contextBridge, ipcRenderer } from "electron";
//Types
import type { ElectronAPI } from "../shared/types/api";
//Shared
import { IPC } from "../shared/types/ipc";

const api: ElectronAPI = {
  getProfiles: () => ipcRenderer.invoke(IPC.GET_PROFILES),
  addProfile: (profile) => ipcRenderer.invoke(IPC.ADD_PROFILE, profile),
  deleteProfile: (name) => ipcRenderer.invoke(IPC.DELETE_PROFILE, name),
  setDefault: (name) => ipcRenderer.invoke(IPC.SET_DEFAULT, name),
  login: (profileName, otpCode) => ipcRenderer.invoke(IPC.LOGIN, { profileName, otpCode }),
  logout: (profileName) => ipcRenderer.invoke(IPC.LOGOUT, profileName),
  verifySession: (profileName) => ipcRenderer.invoke(IPC.VERIFY_SESSION, profileName),
};

contextBridge.exposeInMainWorld("api", api);
