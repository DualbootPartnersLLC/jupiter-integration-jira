import JiraApi from "jira-client";

import { Project, ServerInfo } from "./types";

interface JiraParams {
  host: string;
  password: string;
  username: string;
}

export default class JiraClient {
  private client: JiraApi;
  private host: string;
  private username: string;
  private password: string;

  constructor(params: JiraParams) {
    this.host = params.host;
    this.username = params.username;
    this.password = params.password;
  }

  public async authenticate() {
    this.client = new JiraApi({
      protocol: "https",
      host: this.host,
      username: this.username,
      password: this.password,
      apiVersion: "2",
      strictSSL: true,
    });
  }

  public async fetchProjects(): Promise<Project[]> {
    const projects: Project[] = (await this.client.listProjects()) as Project[];

    return projects;
  }

  public async fetchServerInfo(): Promise<ServerInfo> {
    // @ts-ignore: calling private method
    const info: ServerInfo = (await this.client.getServerInfo()) as ServerInfo;

    return info;
  }
}
