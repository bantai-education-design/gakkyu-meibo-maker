import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("classRosterMaker", {
  platform: process.platform,
  isDesktop: true
});
