export interface ServerInfo {
  baseUrl: string;
  version: string;
  versionNumbers: number[];
  buildNumber: number;
  buildDate: string;
  serverTime: string;
  scmInfo: string;
  serverTitle: string;
}

export interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    [size: string]: string;
  };
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
}

export interface JiraDataModel {
  serverInfo: ServerInfo;
  projects: Project[];
  users: User[];
}

export interface User {
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: {
    [size: string]: string;
  };
  active: boolean;
  accountId: string;
  emailAddress: string;
  displayName: string;
  timeZone: string;
  locale: string;
}

export interface Group {
  name: string;
}
