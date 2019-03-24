/* tslint:disable:no-console */
import {
  createLocalInvocationEvent,
  executeSingleHandlerLocal,
} from "@jupiterone/jupiter-managed-integration-sdk/local";
import { createLogger, TRACE } from "bunyan";
import { executionHandler } from "../src/index";

async function run(): Promise<void> {
  const logger = createLogger({ name: "local", level: TRACE });

  const projects = process.env.PROJECTS_KEY || "";

  const integrationConfig = {
    jiraLogin: process.env.JIRA_LOGIN,
    jiraPassword: process.env.JIRA_PASSWORD,
    host: process.env.JIRA_HOST,
    projects: projects.split(","),
  };

  const invocationArgs = {
    // providerPrivateKey: process.env.PROVIDER_LOCAL_EXECUTION_PRIVATE_KEY
  };

  logger.info(
    await executeSingleHandlerLocal(
      integrationConfig,
      logger,
      executionHandler,
      invocationArgs,
      createLocalInvocationEvent(),
    ),
    "Execution completed successfully!",
  );
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
