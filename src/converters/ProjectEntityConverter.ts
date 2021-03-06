import { Project } from "../jira";
import {
  PROJECT_ENTITY_CLASS,
  PROJECT_ENTITY_TYPE,
  ProjectEntity,
} from "../jupiterone";

import generateEntityKey from "../utils/generateEntityKey";

export function createProjectEntities(data: Project[]): ProjectEntity[] {
  return data.map(project => {
    const projectEntity: ProjectEntity = {
      _key: generateEntityKey(PROJECT_ENTITY_TYPE, project.id),
      _type: PROJECT_ENTITY_TYPE,
      _class: PROJECT_ENTITY_CLASS,
      id: project.id,
      displayName: project.name,
      self: project.self,
      key: project.key,
      name: project.name,
      projectTypeKey: project.projectTypeKey,
      simplified: project.simplified,
      style: project.style,
      isPrivate: project.isPrivate,
      webLink: project.url,
    };

    return projectEntity;
  });
}
