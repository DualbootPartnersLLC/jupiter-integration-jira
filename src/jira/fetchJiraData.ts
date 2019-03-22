import JiraClient from "./JiraClient";
import { JiraDataModel } from "./types";

export default async function fetchJiraData(
  client: JiraClient,
): Promise<JiraDataModel> {
  const [projects, serverInfo, users] = await Promise.all([
    client.fetchProjects(),
    client.fetchServerInfo(),
    client.fetchUsers(),
    client.fetchGroups(),
  ]);

  // const groupsMembers = await Promise.all(
  //   groups.map(group => {
  //     return group.id ? client.fetchMembers(group.id) : [];
  //   }),
  // );

  // const allMembers = groupsMembers.reduce((acc, value) => {
  //   return acc.concat(value);
  // }, []);

  return { projects, serverInfo, users };
}
