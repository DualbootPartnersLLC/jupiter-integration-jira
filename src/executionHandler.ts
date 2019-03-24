import {
  IntegrationExecutionContext,
  IntegrationExecutionResult,
  IntegrationInvocationEvent,
  summarizePersisterOperationsResults,
} from "@jupiterone/jupiter-managed-integration-sdk";

import initializeContext from "./initializeContext";
import fetchJiraData from "./jira/fetchJiraData";
import fetchEntitiesAndRelationships from "./jupiterone/fetchEntitiesAndRelationships";
import publishChanges from "./persister/publishChanges";

export default async function executionHandler(
  context: IntegrationExecutionContext<IntegrationInvocationEvent>,
): Promise<IntegrationExecutionResult> {
  const { graph, persister, provider } = await initializeContext(context);

  const oldData = await fetchEntitiesAndRelationships(graph);
  const jiraData = await fetchJiraData(provider, context);

  return {
    operations: summarizePersisterOperationsResults(
      await publishChanges(persister, oldData, jiraData),
    ),
  };
}
