import { GraphClient } from "@jupiterone/jupiter-managed-integration-sdk";

import * as Entities from "./entities";

export interface JupiterOneEntitiesData {
  accounts: Entities.AccountEntity[];
  projects: Entities.ProjectEntity[];
  users: Entities.UserEntity[];
}

export interface JupiterOneRelationshipsData {
  accountProjectRelationships: Entities.AccountProjectRelationship[];
}

export interface JupiterOneDataModel {
  entities: JupiterOneEntitiesData;
  relationships: JupiterOneRelationshipsData;
}

export default async function fetchEntitiesAndRelationships(
  graph: GraphClient,
): Promise<JupiterOneDataModel> {
  const data: JupiterOneDataModel = {
    entities: await fetchEntities(graph),
    relationships: await fetchRelationships(graph),
  };

  return data;
}

async function fetchEntities(
  graph: GraphClient,
): Promise<JupiterOneEntitiesData> {
  const [accounts, projects, users] = await Promise.all([
    graph.findEntitiesByType<Entities.AccountEntity>(
      Entities.ACCOUNT_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.ProjectEntity>(
      Entities.PROJECT_ENTITY_TYPE,
    ),
    graph.findEntitiesByType<Entities.UserEntity>(Entities.USER_ENTITY_TYPE),
  ]);

  return {
    accounts,
    projects,
    users,
  };
}

export async function fetchRelationships(
  graph: GraphClient,
): Promise<JupiterOneRelationshipsData> {
  const [accountProjectRelationships] = await Promise.all([
    graph.findRelationshipsByType(Entities.ACCOUNT_PROJECT_RELATIONSHIP_TYPE),
  ]);

  return {
    accountProjectRelationships,
  };
}
