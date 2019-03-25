import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import JiraClient from "./JiraClient";
import { JiraDataModel } from "./types";

export default async function fetchJiraData(
  client: JiraClient,
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
): Promise<JiraDataModel> {
  const [projects, serverInfo, users] = await Promise.all([
    client.fetchProjects(),
    client.fetchServerInfo(),
    client.fetchUsers(),
  ]);

  const {
    instance: { config },
  } = context;

  const allProjectsNames: string[] =
    projects &&
    projects.reduce(
      (acc, project) => {
        if (project && project.name) {
          acc.concat(project.name);
        }
        return acc;
      },
      [] as string[],
    );

  const projectsToIngest: string[] = config.projects
    ? config.projects.split(",")
    : allProjectsNames;

  const projectIssues = await Promise.all(
    projectsToIngest.map((project: string) => client.fetchIssues(project)),
  );

  const issues =
    projectIssues &&
    projectIssues.reduce((acc, value) => {
      return acc.concat(value);
    }, []);

  return { projects, serverInfo, users, issues };
}
