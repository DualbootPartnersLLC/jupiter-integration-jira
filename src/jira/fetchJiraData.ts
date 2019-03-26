import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import JiraClient from "./JiraClient";
import { JiraDataModel } from "./types";

interface ProjectKey {
  key: string;
}

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

  const fetchedProjectsKeys: ProjectKey[] =
    projects && projects.map(project => ({ key: project.name }));

  const configProjectsKeys = config.projects && JSON.parse(config.projects);

  const projectsToIngest: ProjectKey[] =
    configProjectsKeys && configProjectsKeys.length > 0
      ? configProjectsKeys
      : fetchedProjectsKeys;

  const projectIssues = await Promise.all(
    projectsToIngest.map((item: ProjectKey) => client.fetchIssues(item.key)),
  );

  const issues =
    projectIssues &&
    projectIssues.reduce((acc, value) => {
      return acc.concat(value);
    }, []);

  return { projects, serverInfo, users, issues };
}
