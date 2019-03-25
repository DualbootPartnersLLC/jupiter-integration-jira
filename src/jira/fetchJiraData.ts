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

  const projectsToIngest: string[] =
    config.projects.length === 0
      ? projects.map(project => project.name)
      : config.projects;

  const projectIssues = await Promise.all(
    projectsToIngest.map((project: string) => client.fetchIssues(project)),
  );

  const issues = projectIssues.reduce((acc, value) => {
    return acc.concat(value);
  }, []);

  return { projects, serverInfo, users, issues };
}
