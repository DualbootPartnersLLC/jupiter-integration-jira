import {
  IntegrationExecutionContext,
  IntegrationInvocationEvent,
} from "@jupiterone/jupiter-managed-integration-sdk";
import executionHandler from "./executionHandler";
import initializeContext from "./initializeContext";

jest.mock("./initializeContext");

test("executionHandler", async () => {
  const executionContext = {
    graph: {
      findEntitiesByType: jest.fn().mockResolvedValue([]),
      findRelationshipsByType: jest.fn().mockResolvedValue([]),
    },
    persister: {
      processEntities: jest.fn().mockReturnValue([]),
      processRelationships: jest.fn().mockReturnValue([]),
      publishPersisterOperations: jest.fn().mockResolvedValue({}),
    },
    provider: {
      authenticate: jest.fn().mockReturnValue({}),
      fetchProjects: jest.fn().mockReturnValue([]),
      fetchServerInfo: jest.fn().mockReturnValue([]),
      fetchIssues: jest.fn().mockReturnValue([]),
      fetchUsers: jest.fn().mockReturnValue([]),
    },
    account: {
      id: "",
      name: "",
    },
  };

  (initializeContext as jest.Mock).mockReturnValue(executionContext);

  const invocationContext = {
    instance: {
      config: {},
    },
  } as IntegrationExecutionContext<IntegrationInvocationEvent>;

  await executionHandler(invocationContext);

  expect(initializeContext).toHaveBeenCalledWith(invocationContext);
  expect(executionContext.provider.fetchProjects).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchServerInfo).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchUsers).toHaveBeenCalledTimes(1);
  expect(executionContext.provider.fetchIssues).toHaveBeenCalledTimes(0);
  expect(executionContext.persister.processEntities).toHaveBeenCalledTimes(4);
  expect(
    executionContext.persister.publishPersisterOperations,
  ).toHaveBeenCalledTimes(1);
});
