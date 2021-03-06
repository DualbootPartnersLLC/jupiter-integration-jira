import "jest-extended";
import nock from "nock";
import JiraClient from "./JiraClient";

const JIRA_LOCAL_EXECUTION_HOST =
  process.env.JIRA_LOCAL_EXECUTION_HOST || "example.atlassian.com";

function prepareScope(def: nock.NockDefinition) {
  def.scope = `https://${JIRA_LOCAL_EXECUTION_HOST}:443`;
}

describe("JiraClient fetch ok data", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    process.env.CI
      ? nock.back.setMode("lockdown")
      : nock.back.setMode("record");
  });

  async function getAuthenticatedClient() {
    const client = new JiraClient({
      host: JIRA_LOCAL_EXECUTION_HOST,
      username: process.env.JIRA_LOCAL_EXECUTION_USERNAME || "",
      password: process.env.JIRA_LOCAL_EXECUTION_PASSWORD || "",
    });

    return client;
  }

  test("fetch server info ok", async () => {
    const { nockDone } = await nock.back("server-info-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const response = await client.fetchServerInfo();
    expect(response).toContainKeys(["baseUrl", "serverTitle"]);
    nockDone();
  });

  test("fetch projects ok", async () => {
    const { nockDone } = await nock.back("projects-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const response = await client.fetchProjects();
    expect(response).toBeArray();
    expect(response).not.toBeArrayOfSize(0);
    expect(response.map(value => value.name)).toEqual([
      "First Project",
      "Second project",
    ]);
    nockDone();
  });

  test("fetch users ok", async () => {
    const { nockDone } = await nock.back("users-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const response = await client.fetchUsers();
    expect(response).toBeArray();
    expect(response).not.toBeArrayOfSize(0);
    nockDone();
  });

  test("fetch issues with existing project ok", async () => {
    const { nockDone } = await nock.back("issues-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const response = await client.fetchIssues("First Project");
    expect(response).toBeArray();
    expect(response).not.toBeArrayOfSize(0);
    nockDone();
  });

  test("fetch issues with existing project and with updatedAt filter ok", async () => {
    const { nockDone } = await nock.back("issues-updatedAt-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const response = await client.fetchIssues(
      "First Project",
      Date.parse("2019-04-08T12:51:50.417Z"),
    );
    expect(response).toBeArray();
    expect(response).not.toBeArrayOfSize(0);
    nockDone();
  });

  test("fetch issues with not existing project ok", async () => {
    const { nockDone } = await nock.back("issues-not-existed-exception.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    await expect(client.fetchIssues("NotExistedProject")).rejects.toThrow();
    nockDone();
  });

  test("fetch issues with empty param project ok", async () => {
    const { nockDone } = await nock.back("issues-empty-param-ok.json", {
      before: prepareScope,
    });
    const client = await getAuthenticatedClient();
    const issues = await client.fetchIssues("");
    expect(issues).toEqual([]);
    nockDone();
  });

  afterAll(() => {
    nock.restore();
  });
});

describe("JiraClient bad credentials", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    nock.back.setMode("record");
  });

  async function getAuthenticatedClient() {
    const client = new JiraClient({
      host: JIRA_LOCAL_EXECUTION_HOST,
      username: "fakeUser",
      password: "fakePassword",
    });

    return client;
  }

  test("fetch server info with bad auth", async () => {
    const { nockDone } = await nock.back("projects-bad.json", {
      before: prepareScope,
    });

    const client = await getAuthenticatedClient();
    await expect(client.fetchProjects()).rejects.toThrow();

    nockDone();
  });

  afterAll(() => {
    nock.restore();
  });
});

describe("JiraClient creating data", () => {
  beforeAll(() => {
    nock.back.fixtures = `${__dirname}/../../test/fixtures/`;
    nock.back.setMode("record");
  });

  async function getAuthenticatedClient() {
    const client = new JiraClient({
      host: JIRA_LOCAL_EXECUTION_HOST,
      username: process.env.JIRA_LOCAL_EXECUTION_USERNAME || "",
      password: process.env.JIRA_LOCAL_EXECUTION_PASSWORD || "",
    });

    return client;
  }

  test("create issue with existing project ok", async () => {
    const client = await getAuthenticatedClient();
    const { nockDone: creatingDone } = await nock.back("issue-create-ok.json", {
      before: prepareScope,
    });
    const createdIssue = await client.addNewIssue("Test Issue", 10000, "Task");
    creatingDone();

    expect(createdIssue).toContainKeys(["id", "key", "self"]);
    expect(createdIssue).not.toContainKeys([
      "parent",
      "project",
      "creator",
      "reporter",
      "fields",
    ]);

    const { nockDone: findingDone } = await nock.back("issue-found-ok.json", {
      before: prepareScope,
    });
    const foundIssue = await client.findIssue(createdIssue.id);
    findingDone();

    expect(foundIssue).toContainKeys(["id", "key", "self", "fields"]);
  });

  afterAll(() => {
    nock.restore();
  });
});
